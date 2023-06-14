#!/bin/bash

# Check if necessary tools are installed
for cmd in yt-dlp parallel jq redis-cli shuf yq; do
    if ! command -v $cmd &> /dev/null; then
        echo "$cmd is not installed. Please install it before running this script."
        exit 1
    fi
done

# Variables
redis_host=""
parallel_jobs="1"
yaml_file=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --redis=*)
        redis_host="${1#*=}"
        ;;
        -j*)
        if [[ $1 =~ ^-j[0-9]+$ ]]; then
            parallel_jobs="${1#*j}"
        else
            parallel_jobs="$2"
            shift
        fi
        ;;
        -f)
        yaml_file="$2"
        shift
        ;;
    esac
    shift
done

# Check YAML file existence
if [[ ! -f "$yaml_file" ]]; then
    echo "YAML file $yaml_file does not exist. Please provide a valid file."
    exit 1
fi

# If redis host not provided, get from YAML
if [ -z "$redis_host" ]; then
    redis_host=$(yq eval '.redis-host' $yaml_file)
    if [ -z "$redis_host" ]; then
        echo "Redis host is required. Please provide it using --redis option or in the YAML file."
        exit 1
    fi
fi

# If parallel jobs not provided, get from YAML
if [ "$parallel_jobs" == "1" ]; then
    parallel_jobs=$(yq eval '.jobs' $yaml_file)
    if [ "$parallel_jobs" == "null" ]; then
        parallel_jobs="1"
    fi
fi

# Check that at least one playlist URL is provided
if [ $(yq eval '.playlists | length' $yaml_file) -eq 0 ]; then
    echo "At least one YouTube playlist URL is required in the YAML file."
    exit 1
fi

# Iterate over all playlist URLs from the YAML file
{
yq eval '.playlists[]' $yaml_file | while read -r yt_playlist
do
    # Extract playlist name from the first video's JSON data
    playlist_name=$(yt-dlp --flat-playlist --dump-json "$yt_playlist" | jq -r '.playlist_title' | head -1)
    # Replace spaces with underscores in playlist name
    playlist_name=${playlist_name// /_}

    # Temporary and final list names
    temp_list_name="${playlist_name}_temp"
    final_list_name="${playlist_name}"

    # Delete existing Redis lists if they exist
    redis-cli -h $redis_host del $temp_list_name
    redis-cli -h $redis_host del $final_list_name

    # Push audio URLs to temporary Redis list
    yt-dlp --get-id "$yt_playlist" | parallel -j $parallel_jobs "\
    audio_url=\$(yt-dlp -f bestaudio --get-url 'https://www.youtube.com/watch?v={}') ;\
    video_info=\$(yt-dlp --dump-json 'https://www.youtube.com/watch?v={}') ;\
    redis-cli -h $redis_host rpush $temp_list_name \"\$(echo \$video_info | jq -c --arg url \$audio_url '{title: .title, artist: .uploader, thumbnail: .thumbnail, url: \$url}')\""

    # Shuffle the temporary Redis list and push to the final list
    redis-cli -h $redis_host lrange $temp_list_name 0 -1 | shuf | while read item; do redis-cli -h $redis_host rpush $final_list_name "$item"; done

    # Delete temporary Redis list
    redis-cli -h $redis_host del $temp_list_name
done
} 1>/dev/null
