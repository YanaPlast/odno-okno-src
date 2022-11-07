# Как задействовать в верстке React.js

React и Vue — два наиболее популярных фронтенд-фреймворка для реализации UX-логики. Оба используют компонентный подход и входят в эту сборку, так что их можно использовать без дополнительной настройки.

Чтобы лучше понять принципы работы, я воспроизведу пример с [карточкой товара](08-incapsulate-js-logic.md) на каждом из этих фреймворков. Начну с React.

## Базовая верстка карточки товара

Набрасываем первый прототип карточки товара. Пока это только верстка. Основная js-логика будет связана с кнопкой "Купить" — её мы и превратим в react-компонент.

    <div class="product-card card">
        <img src="..." class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">Аннигиляторная пушка</h5>
            <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p class="product-card__price card-text">$50</p>
            <button class="btn btn-primary">Купить</button>
        </div>
    </div>

## Готовим к работе с js

На этом этапе мы добавляем js-классы и заменяем кнопку "Купить" на пустой `<div>`, в котором далее инициализируем компонент кнопки.

    <div class="product-card card js-product-card" data-product-id="12345">
        <img src="..." class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">Аннигиляторная пушка</h5>
            <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p class="product-card__price card-text">$50</p>
            <div class="js-buy-btn"></div>
        </div>
    </div>

## Создаем react-компонент кнопки, который пока ничего не делает

Поместим его в `./src/scripts/main/react/components/BuyBtn.js`:

    import React from "react";
    export class BuyBtn extends React.Component {
        render() {
            return (
                <button className="btn btn-primary">Купить</button>
            );
        }
    }

Затем нужно этот простой компонент отрендерить. Это можно сделать в скрипте `./src/scripts/main/components/ProductCard.js`, который мы использовали в [рецепте по изоляции js-логики](08-incapsulate-js-logic.md):

    import React from "react";
    import ReactDOM from "react-dom";
    import {BuyBtn} from "@main/react/components/BuyBtn";

    class ProductCard {
        constructor(el) {
            this.element = el;
            this.productId = this.element.getAttribute("data-product-id");
            this.buyBtnContainer = this.element.querySelector(".js-buy-btn");
            this.initBuyBtn();
        }

        initBuyBtn() {
            ReactDOM.render(
                React.createElement(BuyBtn, {}, null),
                this.buyBtnContainer
            );
        }
    }

    document.querySelectorAll(".js-product-card").forEach(card => new ProductCard(card));

Думаю что вы могли заметить некоторую путаницу с понятием "компонент". Наш react-компонент лежит в `@main/react/components`, плюс еще есть компонент `ProductCard`, который сделан вовсе не на react, и лежит в `@main/components`.

Чтобы избежать путаницы в терминологии, можно взглянуть на `ProductCard` под другим углом — и назвать его поведением (behavior). Действительно, в нем мы описываем поведение всех блоков с классом `.js-product-card`.

И тогда все становится на свои места: в файле `@main/behaviors/ProductCardBehavior.js` у нас будет поведение, которое инициализирует компонент из `@main/react/components/BuyBtn.js`.

А можно пойти еще дальше, и вместо того, чтобы хранить поведения и компоненты в отдельных папках, объединить их по смыслу и поместить рядом.
Тогда у нас получится директория `@main/behaviors/ProductCard`, в которой рядом будут лежать файлы `ProductCardBehavior.js` и `BuyBtn.js`.
Этот подход ближе к так называемому [Domain-driven design](https://ru.wikipedia.org/wiki/Предметно-ориентированное_проектирование).

## Добавляем react-кнопке поведение

Сейчас мы говорим именно о поведении самой кнопки "Купить" — что будет происходить при нажатии на неё.

Сначала передадим кнопке идентификатор товара через props. В файле `ProductCardBehavior.js`:

    initBuyBtn() {
        ReactDOM.render(
            React.createElement(BuyBtn, {productId: this.productId}, null),
            this.buyBtnContainer
        );
    }

Затем в компоненте кнопки `BuyBtn.js` опишем начальное состояние:

    constructor(props) {
        super(props);
        this.state = { disabled: false, text: "Купить" };
        this.buy = this.buy.bind(this);
    }

Изменим рендер-функцию, чтобы внешний вид кнопки зависел от состояния:

    render() {
        return (
            <button className="btn btn-primary" disabled={this.state.disabled} onClick={this.buy}>{this.state.text}</button>
        );
    }

Чтобы лучше понять суть React-компонентов, можно воспринимать их как обычную функцию, которая принимает на вход некий объект с данными (состояние) и возвращает на его основе готовую HTML-разметку.
Меняется состояние — меняется разметка. Простой принцип, не правда ли? Это позволяет не думать о том, какие именно изменения в DOM должны случиться при совершении тех или иных действий.
Вместо этого вы управляете данными (т.е. состоянием), а изменение HTML возьмет на себя React.

Последним шагом добавим обработчик нажатия:

    buy(e) {
        e.preventDefault();
        if (this.state.disabled) return;
        $.post("/api/basket/add", {product_id: this.props.productId});
        this.setState({
            disabled: true,
            text: "В корзине"
        })
    }

Заметьте, что я намеренно упростил пример. В нем нет обработки ответа от сервера, т.е. мы предполагаем, что роут `/api/basket/add` не дает сбоев.
В реальной жизни это всё нужно обязательно проверять.

Кроме того, опять же, для упрощения, здесь используется jQuery, чтобы выполнить ajax-запрос.
Если задаться вопросом "[а нужен ли тут jQuery](05-add-jquery.md)?", можно найти годные альтернативы — нативный [fetch](https://developer.mozilla.org/ru/docs/Web/API/Fetch_API/Using_Fetch) и популярный [axios](https://github.com/axios/axios).

## Что получилось

Начальное состояние:

![Initial state](images/12-add-react-1.png)

После покупки:

![After click](images/12-add-react-2.png)
