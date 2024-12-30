start: build
	export HEARDLE_CHRISTMAS=true # set to "false" when it's a non-christmas party
	npx next start --port=9042

populate:
	docker compose up -d
	cd scripts/populate-redis; ./populate-redis.sh; cd -

build:
	@echo "!!! REMEMBER TO POPULATE YOUR REDIS INSTANCE !!! (\`make populate\` perhaps?)"
	npm install
	npx next build
