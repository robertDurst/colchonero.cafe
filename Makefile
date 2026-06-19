# Thin wrappers around the npm scripts — for muscle memory.
.PHONY: serve dev build preview install check

serve:   ## Dev server with hot reload  →  http://localhost:4321
	npm run dev

dev: serve

build:   ## Type-check + tests + static build to dist/
	npm run build

preview: ## Serve the built dist/ locally
	npm run start

install: ## Install dependencies
	npm install

check:   ## Type-check + content schema only
	npm run check
