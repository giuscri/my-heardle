start: build
	npx next start --port=9042

populate:
	docker compose up -d
	cd scripts/populate-redis; docker build . --platform=linux/amd64 -t populate-redis:latest; docker run --rm -ti --platform=linux/amd64 --network=host populate-redis; cd -

build:
	@echo "!!! REMEMBER TO POPULATE YOUR REDIS INSTANCE !!! (\`make populate\` perhaps?)"
	npx next build
