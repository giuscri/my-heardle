FROM alpine

ADD https://github.com/yt-dlp/yt-dlp/releases/download/2024.12.23/yt-dlp_linux /usr/local/bin/yt-dlp
RUN chmod +x /usr/local/bin/yt-dlp

RUN apk add -U parallel bash jq yq redis

COPY config.yaml .
COPY populate-redis.sh .

# `sysctl -n hw.ncpu` returns 11 on current daily driver (macbook pro)
CMD ["./populate-redis.sh", "-j11", "-f", "config.yaml"]
