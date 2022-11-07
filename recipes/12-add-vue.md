# Как задействовать в верстке Vue.js

React и Vue — два наиболее популярных фронтенд-фреймворка для реализации UX-логики. Оба используют компонентный подход и входят в эту сборку, так что их можно использовать без дополнительной настройки.

Чтобы лучше понять принципы работы, я воспроизведу пример с [карточкой товара](08-incapsulate-js-logic.md) на каждом из этих фреймворков.

В предыдущем рецепте использовали [react](12-add-react.md), а здесь рассмотрим аналогичную функциональность на vue.

## Карточка товара

Первые шаги по подготовке верстки к использованию компонента полностью идентичны тем, что мы делали в случае с React. В итоге у нас получается такая разметка:

    <div class="product-card card js-product-card" data-product-id="12345">
        <img src="..." class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">Аннигиляторная пушка</h5>
            <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p class="product-card__price card-text">$50</p>
            <div class="js-buy-btn"></div>
        </div>
    </div>

В блоке с классом `.js-buy-btn` мы будем инициализировать компонент с кнопкой "Купить".

## Создаем vue-компонент кнопки, который пока ничего не делает

Поместим его в `./src/scripts/main/behaviors/ProductCard/BuyBtn.vue`:

    <template>
        <button class="btn btn-primary">Купить</button>
    </template>

    <script lang="js">
        export default {

        }
    </script>

Аналогичный react-компонент представляет собой обычный js-класс с render-функцией, которая содержит шаблон вывода.
В отличие от него, vue предполагает отделение шаблона в отдельной директиве `<template>`, в то время как работа с состоянием (данные и функции для работы с ними) расположены в теге `<script>`.
Обратите внимание, что у тега `script` явно указан атрибут `lang` — это подсказка для сборщика, на каком языке вы пишете: javascript или typescript. 
Атрибут можно не указывать — языком по-умолчанию считается javascript.

Чтобы отрендерить наш компонент, вернемся к файлу `./src/scripts/main/behaviors/ProductCard/ProductCardBehavior.js`:

    import Vue from "vue/dist/vue.js";
    import BuyBtn from "@main/behaviors/ProductCard/BuyBtn.vue";

    class ProductCardBehavior {
        constructor(el) {
            this.element = el;
            this.productId = this.element.getAttribute("data-product-id");
            this.buyBtnContainer = this.element.querySelector(".js-buy-btn");
            this.initBuyBtn();
        }

        initBuyBtn() {
            new Vue({
                el: this.buyBtnContainer,
                components: { BuyBtn },
                template: '<BuyBtn/>'
            });
        }
    }

    document.querySelectorAll(".js-product-card").forEach(card => new ProductCardBehavior(card));

Можно заметить, что конструктор класса не изменился, а вот метод `initBuyBtn()` отличается от примера с react-компонентом.

Здесь мы создаем новый экземпляр Vue, передавая ему три параметра:

- в `el` мы указываем, где рендерить компонент.
- в `components` мы перечисляем, какие компоненты будут доступны этому экземпляру Vue-приложения
- в `template` мы описываем шаблон вывода, в котором будет единственная строчка с вызовом компонента.

## Добавляем vue-кнопке поведение

Сейчас мы говорим именно о поведении самой кнопки "Купить" — что будет происходить при нажатии на неё.

Сначала передадим кнопке идентификатор товара через props. В файле `ProductCardBehavior.js` изменим `template`:

    initBuyBtn() {
        new Vue({
            el: this.buyBtnContainer,
            components: { BuyBtn },
            template: `<BuyBtn product-id="${this.productId}"/>`
        });
    }

Затем в компоненте кнопки `BuyBtn.vue` опишем свойства компонента и его начальное состояние:

    <script lang="js">
        export default {
            props: [ 'productId' ],
            data() {
                return {
                    disabled: false,
                    text: "Купить"
                }
            }
        };
    </script>

Изменим шаблон, чтобы внешний вид кнопки зависел от состояния:

    <template>
        <button class="btn btn-primary" :disabled="disabled" @click.prevent="buy">{{ text }}</button>
    </template>

Последним шагом добавим обработчик нажатия (метод `buy()`):

    <script lang="js">
        export default {
            props: [ 'productId' ],
            data() {
                return {
                    disabled: false,
                    text: "Купить"
                }
            },
            methods: {
                buy() {
                    if (this.disabled) return;
                    $.post("/api/basket/add", {product_id: this.productId});
                    this.disabled = true;
                    this.text = "В корзине";
                }
            }
        };
    </script>

Как видите, общий принцип работы у Vue и React очень похож.
