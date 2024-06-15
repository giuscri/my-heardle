start:
	npm run start

populate:
	docker compose up -d
	cd scripts/populate-redis; docker build . -t populate-redis:latest; docker run --rm -ti --network=host populate-redis; cd -

build: populate
	npm run build
