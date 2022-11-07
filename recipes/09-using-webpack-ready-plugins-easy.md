# Как подключить нормальный слайдер (легко и просто)

В предыдущем [примере](09-using-jquery-plugins-hard.md) рассмотрели долгое и неудобное подключение jQuery-карусели slick.

Удивившись, насколько это геморно, я решил поискать плагин с аналогичной функциональностью, готовый к использованию вместе с webpack.

Одним из первых я нашел [glide](https://glidejs.com/). Попробуем задействовать его, следуя официальной [инструкции](https://glidejs.com/docs/setup/).

## Установка

Привычно через npm:

    npm install --save @glidejs/glide

## Подключение стилей

Делаем это в точке входа стилей `./src/styles/main.scss`:

    @import "~@glidejs/glide/src/assets/sass/glide.core";
    @import "~@glidejs/glide/src/assets/sass/glide.theme";

## Разметка

В любом подходящем njk-шаблоне:

    <div class="glide">
        <div class="glide__track" data-glide-el="track">
            <ul class="glide__slides">
                <li class="glide__slide">
                    <img src="https://images.unsplash.com/photo-1573641287741-f6e223d81a0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=768&h=480&q=80">
                </li>
                <li class="glide__slide">
                    <img src="https://images.unsplash.com/photo-1569271836752-ed9351b75521?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&h=480&q=80">
                </li>
                <li class="glide__slide">
                    <img src="https://images.unsplash.com/photo-1567450121326-28da3797155d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=768&h=480&q=80">
                </li>
            </ul>
        </div>
        <div class="glide__arrows" data-glide-el="controls">
            <button class="glide__arrow glide__arrow--left" data-glide-dir="<">prev</button>
            <button class="glide__arrow glide__arrow--right" data-glide-dir=">">next</button>
        </div>
    </div>

## Инициализация

В любом из подключаемых js-файлов. Например это может быть тот же `./src/scripts/main/components/MainPageSlider.js`:

    import Glide from '@glidejs/glide';
    window.addEventListener('load', () => {
        new Glide('.glide').mount();
    });

## Результат

Вот так быстро и без костылей карусель заработала:

![Slider still works](images/10-using-webpack-ready-plugins-easy.png)