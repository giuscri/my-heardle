start: build
	@echo "!!! REMEMBER TO POPULATE YOUR REDIS INSTANCE !!! (\`make populate\` perhaps?)"
	npx next start --port=9042

populate:
	docker compose up -d
	cd scripts/populate-redis; docker build . -t populate-redis:latest; docker run --rm -ti --network=host populate-redis; cd -

build:
	npx next build
