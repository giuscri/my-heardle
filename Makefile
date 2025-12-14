# set to empty or remove line to disable christmas mode
HEARDLE_CHRISTMAS ?= true
export HEARDLE_CHRISTMAS

start: build
	npx next start --port=9042

populate:
	docker compose up -d
	cd scripts/populate-redis; ./populate-redis.sh -f config.yaml; cd -

build:
	@echo "!!! REMEMBER TO POPULATE YOUR REDIS INSTANCE !!! (\`make populate\` perhaps?)"
	npm install
	npx next build
