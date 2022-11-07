set dotenv-load := true

# Команда по умолчанию, которая выводит список всех команд
default:
    just --list

# Выполняет команду в указанном контейнере от пользователя по умолчанию
compose container *command:
    docker-compose run --rm {{container}} {{command}}

# Выполняет команду в контейнере nodejs
nodejs *command:
    just compose nodejs {{command}}

# Выполняет npm-команду в контейнере nodejs
npm *command:
    just nodejs npm {{command}}

# Установка зависимостей NPM
install:
    just npm install

# Установка зависимостей NPM через CI
ci:
    just npm ci

# Сборка фронта в режиме development
build:
    just npm run build

# Сборка фронта в режиме production
release:
    just npm run release

# Запуск Webpack в режиме watch
watch:
    just npm run watch

# Запуск webpack-dev-server
serve:
    docker-compose run --service-ports --rm nodejs npm run network-server

# Запуск линтера фронтенда
lint:
    just npm run lint
