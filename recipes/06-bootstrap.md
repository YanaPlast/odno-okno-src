# Как добавить в сборку Bootstrap

Руководствуясь этим гайдом — https://getbootstrap.com/docs/4.0/getting-started/webpack/

**Шаг 1: установка**

Ставим сам bootstrap и его зависимости:

    npm install --save bootstrap popper.js

**Шаг 2: подключение js**

Проще всего подключить его в точке входа всей сборки: `./src/main.js`:

    import "bootstrap";

**Шаг 3: подключение стилей**

Это делается в точке входа стилей: `./src/styles/main.scss`:

    @import "bootstrap_vars.scss"; // необязательно. в этом файле можно переопределить переменные bootstrap
    @import "~bootstrap/scss/bootstrap";

**Шаг 4: кастомизация**

Если нужна кастомизация базовой темы, то можно переопределить стандартные переменные в файле `./src/styles/bootstrap_vars.scss`.

Подробнее про кастомизацию можно почитать здесь: https://getbootstrap.com/docs/4.0/getting-started/theming/

Например, можно сделать фон по-умолчанию черным, а текст белым:

    $body-bg: #000;
    $body-color: #fff;

## Что получилось

Чтобы проверить результат, я дополнительно закинул в нашу верстку несколько базовых bootstrap-блоков. Получилось вот так:

![Bootstrap added](images/07-bootstrap.png)
