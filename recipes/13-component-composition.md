# Композиция компонентов

В предыдущих примерах мы использовали [react](12-add-react.md) и [vue](13-add-vue.md) для создания компонента-кнопки "Купить". Выглядело это примерно так:

    <div class="product-card card js-product-card" data-product-id="12345">
        <img src="..." class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">Аннигиляторная пушка</h5>
            <p class="card-text">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p class="product-card__price card-text">$50</p>
            <div class="js-buy-btn">
                <BuyBtn/> <-- компонент-кнопка
            </div>
        </div>
    </div>

Если присмотреться к этому фрагменту разметки, становится очевидно, что он сам по себе является регулярно повторяющимся блоком, который тоже можно вынести в компонент и переиспользовать.

Давайте попробуем это сделать. Дальнейшие примеры будут на Vue, но их не составит труда адаптировать к React, потому что, как вы помните, принципы работы у этих фреймворков довольно схожи.

## Создаем новый single-file component

Поместим его рядом с компонентом кнопки, в файле `./src/scripts/main/behaviors/ProductCard/ProductCard.vue`:

    <template>
        <div class="product-card card">
            <img :src="image" class="card-img-top" alt="">
            <div class="card-body">
                <h5 class="card-title">{{ name }}</h5>
                <p class="card-text">{{ description }}</p>
                <p class="product-card__price card-text">{{ price }}</p>
                <BuyBtn :product-id="productId"/>
            </div>
        </div>
    </template>

    <script lang="js">
        import BuyBtn from "@main/behaviors/ProductCard/BuyBtn.vue";

        export default {
            props: ["productId", "name", "description", "price", "image"],
            components: {BuyBtn}
        }
    </script>

Все изменяемые параметры товара мы обозначаем в массиве `props`: это идентификатор товара, его название, описание, цена и картинка.

В поле `components` мы обозначаем вложенные компоненты, которые нам понадобятся. На данный момент это компонент с кнопкой "Купить".

В шаблоне мы отображаем, как будет выглядеть карточка товара, используя в разметке свойства (`props`) и вложенные компоненты (`BuyBtn`).

## Как это всё инициализировать?

Допустим, нам нужно отобразить набор карточек товара по какому-то признаку. Например, это может быть блок "Самые продаваемые товары" на главной странице сайта.

Прежде всего, нам нужно будет получить данные о товарах. Проще всего сделать это ajax-запросом. Поместим его например в `./src/scripts/main/behaviors/CatalogTop/CatalogTopBehavior.js`:

    class CatalogTopBehavior {
        constructor(el, products) {
            // ...
        }
    }

    const container = document.getElementById("catalog-top");
    $.get("/api/catalog/top", response => new CatalogTopBehavior(container, response));

Вся дальнейшая инициализация пойдет в классе CatalogTopBehavior, в который мы передали контейнер, где хотим видеть карточки товаров, и json-данные по самим карточкам.

Итоговый код класса может выглядеть например так:

    import Vue from "vue/dist/vue.js";
    import ProductCard from "@main/behaviors/ProductCard/ProductCard.vue";

    class CatalogTopBehavior {
        constructor(el, products) {
            new Vue({
                el: el,
                components: {ProductCard},
                data: {
                    products,
                },
                template: `
                    <div class="catalog-items">
                        <ProductCard v-for="product in products" :key="product.id"
                            :product-id="product.id"
                            :name="product.name"
                            :description="product.description"
                            :price="product.price"
                            :image="product.image"/>
                    </div>
                `
            }));
        }
    }

Ну а если и на этом не остановиться, то поведение `CatalogTopBehavior` можно заменить компонентом `<ProductCardList :products="ajaxResponse"/>` и так далее:

    <CatalogSection>
        <CatalogFilter/>
        <CatalogSortButtons/>
        <ProductCardList/>
    </CatalogSection>
