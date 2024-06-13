FROM alpine

ADD https://github.com/yt-dlp/yt-dlp/releases/download/2024.05.26/yt-dlp_linux /usr/local/bin/yt-dlp
RUN chmod +x /usr/local/bin/yt-dlp

RUN apk add -U parallel bash jq yq

COPY config.yaml .
COPY populate-redis.sh .

CMD ["./populate-redis.sh", "--redis=redis", "-j16", "-f", "config.yaml"]
