#!/usr/bin/env python3

import argparse
import json
import random
import subprocess
import redis

parser = argparse.ArgumentParser('populate-redis')
parser.add_argument('--yt-dlp-path')
parser.add_argument('--redis-host')
args = parser.parse_args()

YT_DLP=args.yt_dlp_path or 'yt-dlp'
REDIS_HOST=args.redis_host or 'localhost'

r = redis.Redis(host=REDIS_HOST, port=6379)

playlists = {
    'pop': 'https://music.youtube.com/playlist?list=PLIzPbE6Bl1SpIGDRzUthWrgjRwOKJTCNx',
    'metal': 'https://music.youtube.com/playlist?list=PLIzPbE6Bl1So3o0LMLEK0lyXuwxlUCNBh',
    'evergreen': 'https://music.youtube.com/playlist?list=PLIzPbE6Bl1Sqgc0nHwZQuZ5wQLZ_vqEqv',
    'cartoons': 'https://music.youtube.com/playlist?list=PLIzPbE6Bl1So6PwZLnck5A1qcJRbY716N',
    'italian': 'https://music.youtube.com/playlist?list=PLIzPbE6Bl1SpeNL7mY9YF0jgY39u69xoV',
    'christmas': 'https://music.youtube.com/playlist?list=PLIzPbE6Bl1Sqztlj0yxDGu2h0Ca_YskZ8',
}

queues = {}

for genre in playlists:
    slist = []

    print(f'fetching playlist for {genre}...')
    proc = subprocess.run(f'{YT_DLP} {playlists[genre]} --dump-single-json', shell=True, capture_output=True, check=True)
    if not proc.stdout:
        raise Exception('failed to download playlist info')

    print(f'fetched playlist for {genre}')
    j = json.loads(proc.stdout.decode())
    entries = j['entries']
    for e in entries:
        audioSrc = e['requested_formats'][1]['url']
        slist.append({ 'title': e['title'], 'artist': e['uploader'], 'thumbnailSrc': e['thumbnail'], 'audioSrc': audioSrc })

    for _ in range(5):
        random.shuffle(slist)
        queues[genre] = queues.get(genre, []) + slist

print('dropping old data and storing new ones into redis...')
r.flushdb()
for genre in queues:
    for s in queues[genre]:
        r.lpush(genre, json.dumps(s))
