# Как подключить jQuery-слайдер (геморно)

Думаю что большинство jQuery-плагинов добавляются в сборку ценой немалых усилий.
Это связано с тем, что старый добрый jQuery-way предполагает подключение готовой скомпилированной версии плагина в теге `<head>`:
подключили jQuery, потом скрипт, потом файл стилей — и пользуемся.

Чтобы загнать всё это дело в бандл, придется потрудиться. В качестве примера я выбрал популярную jQuery-карусель [slick](https://kenwheeler.github.io/slick/).

## Установка

Тут все несложно, через npm:

    npm install --save slick-carousel

## Подключение js-библиотеки

Это делается в точке входа в наше js-приложение — `./src/main.js`:

    import "slick-carousel";

Важный нюанс: на момент подключения слайдера у вас уже должен быть глобальный jQuery. В одном из предыдущих [рецептов](05-add-jquery.md) мы использовали такую строчку:

    window.jQuery = window.$ = $;

Она должна идти **до** подключения карусели.

## Подключение стилей

Стили слайдера подключаем в точке входа стилей — `./src/styles/main.scss`:

    @import "~slick-carousel/slick/slick.scss";
    @import "~slick-carousel/slick/slick-theme.scss";

Напомню, что знак тильды (`~`) указывает на папку `node_modules`.

## Добавление недостающих ассетов

Дальше начинается веселье на костылях. Помимо js и css файлов в библиотеке есть еще `ajax-loader.gif` и несколько файлов со шрифтами.
Плагин их никак не импортирует, значит нам придется добавить их в итоговую сборку самостоятельно.

Для этого нужно скопировать их по такому принципу:

    ./node_modules/slick-carousel/slick/ajax-loader.gif -> ./src/assets/images/ajax-loader.gif
    ./node_modules/slick-carousel/slick/fonts/* -> ./src/assets/fonts

А затем нужно прописать новые пути к этим файлам в переменных slick:

    $slick-font-path: "../fonts/";
    $slick-loader-path: "../images/";

Чтобы переопределение переменных сработало, эти значения нужно прописать в `./src/styles/main.scss` **до** импорта стилей slick.

## Добавление разметки

Добавляем разметку в нужный нам файл шаблона (njk):

    <div class="slider js-slider">
        <div class="slider__slide"><img src="https://images.unsplash.com/photo-1573641287741-f6e223d81a0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=768&h=480&q=80"></div>
        <div class="slider__slide"><img src="https://images.unsplash.com/photo-1569271836752-ed9351b75521?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&h=480&q=80"></div>
        <div class="slider__slide"><img src="https://images.unsplash.com/photo-1567450121326-28da3797155d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&h=480&q=80"></div>
    </div>

Класс `.js-slider` понадобится нам для инициализации плагина, а классы `.slider` и `.slider__slide` — для самостоятельной стилизации.
Важно понимать, что они не имеют отношения к классам, которые использует сам slick.

## Инициализация плагина

В каком-то из js-файлов прописываем инициализацию. Например я для этого выбрал файл `./src/scripts/main/components/MainPageSlider.js` (не забудьте его подключить).

    $(".js-slider").slick({
        dots: true,
        adaptiveHeight: false,
        centerMode: true,
        variableWidth: true
    });

## Результат

![Slider works](images/09-using-jquery-plugins-hard.png)