start:
	npm run start

populate:
	docker compose up -d
	cd scripts && time ./populate-redis.sh -j16 -f config.yaml; cd -

build: populate
	npm run build
