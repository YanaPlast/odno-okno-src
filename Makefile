.PHONY: help
.DEFAULT_GOAL := help
SHELL := /bin/bash

ifneq (,$(wildcard ./.env))
    include .env
    export
endif

install: ## Установка зависимостей NPM
	docker-compose run --rm nodejs npm install

ci: ## Установка зависимостей NPM
	docker-compose run --rm nodejs npm ci

build: ## Сборка фронта в режиме development
	docker-compose run --rm nodejs npm run build

release: ## Сборка фронта в режиме production
	docker-compose run --rm nodejs npm run release

watch: ## Запуск Webpack в режиме watch
	docker-compose run --rm nodejs npm run watch

serve: ## Запуск webpack-dev-server
	docker-compose run --service-ports --rm nodejs npm run network-server

lint: ## Запуск линтера фронтенда
	docker-compose run --rm nodejs npm run lint

prettier:
	docker-compose run --rm nodejs npm run-script prettier

help: ## Отображает список команд
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'
