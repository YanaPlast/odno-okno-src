# Как организовать Javascript

Самое главное — не сваливайте весь js в один файл script.js на 5000 строк.
Использование современного диалекта js вместе со сборкой позволяет разбивать единое полотно кода на небольшие фрагменты, которые проще понимать и тестировать.

Точка входа, на которую смотрит сборщик — `./src/main.js`. Теоретически можно писать js-код прямо туда, и он будет работать.
На практике лучше так не делать: точка входа предназначена для общей загрузки приложения, т.е. там в идеале должны быть только инклюды, в которых и будет размещена основная логика приложения.

## Подключаем js-файлы в шаблоне

Результатом сборки js являются три файла:

    ./dist/js/runtime.js // служебный файл, чтобы main.js + vendors.js могли работать вместе
    ./dist/js/vendors.js // в этом файле будут все сторонние библиотеки (из node_modules)
    ./dist/js/main.js    // здесь будет весь написанный вами код

Подключать их следует именно в таком порядке. Сделаем это в `./src/pages/_layout.njk` перед закрывающим `</body>`:

    <script src="js/runtime.js"></script>
    <script src="js/vendors.js"></script>
    <script src="js/main.js"></script>

## Проверяем сборку

Чтобы проверить, что все работает, выведем alert с текстом Hello world при загрузке страницы.
Пока что пропишем это прямо в `./src/main.js`. Итоговый вид этого файла (с учетом импорта стилей) будет таким:

    import "@styles/main.scss";
    window.addEventListener("load", () => alert("Hello world"));

Запускаем dev-сервер:

    npm run dev-server

Затем открываем http://localhost:9966/ и убеждаемся, что alert отобразился.

## Структурируем код

Как было сказано выше, лучше не размещать js-логику непосредственно в `./src/main.js`.
Давайте последуем этому совету, и вынесем наш alert в подключаемый файл.

Сборка предполагает, что эти подключаемые файлы должны располагаться в директории `./src/sripts/main`.

Допустим, что мы пишем код, который должен работать на всех страницах сайта. В таком случае закинем его в файл `./src/sripts/main/app.js`.
Заодно сразу воспользуемся фишками современного диалекта js и поместим всё в одноименный класс:

    export default class App {

        constructor() {
            this.initEvents();
        }

        initEvents() {
            window.addEventListener("load", () => alert("Hello app"));
        }

    }

Чтобы это всё заработало, нам остается только подключить этот файл. Делаем это в `./src/main.js`, который в итоге преобретает такой вид:

    import "@styles/main.scss";
    import App from "@main/app";
    window.App = new App();

Обратите внимание, что для подключения файла `./src/scripts/main/app.js` мы прописали `@main/app`.

Ключ `@main`, как можно догадаться, является ссылкой на `./src/scripts/main`, а расширение .js можно опустить, и писать только название файла.

Чтобы объект приложения был доступен глобально, мы сохраняем его экземпляр в `window.App`.

Обновите страницу http://localhost:9966/, чтобы убедиться, что сборка работает.