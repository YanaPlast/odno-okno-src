# Обмен данными между компонентами

Представьте ситуацию: мы нажали на кнопку "Купить", товар добавился в корзину, и блок "Корзина" в шапке сайта должен обновиться, чтобы показать актуальное содержимое вашей корзины.

Компонент кнопки никак не связан с компонентом корзины, они инициализируются отдельно. Как передать в корзину сигнал о том, что нужно обновить состояние?

Есть несколько решений этой проблемы. Те, что посложнее, предполагают использование некоего хранилища, в котором находится всё состояние приложения — это инструменты MobX, Redux, Vuex.

Но есть более простой способ — глобальная шина событий, о ней и поговорим. Примеры снова на Vue.

## Исходные компоненты

Один из них нам знаком — это кнопка "Купить". Компонент расположен в файле `./src/scripts/main/behaviors/ProductCard/BuyBtn.vue`:

    <template>
        <button class="btn btn-primary" :disabled="disabled" @click.prevent="buy">{{ text }}</button>
    </template>

    <script lang="js">
        export default {
            props: [ "productId" ],
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

Простой шаблон и единственный метод для добавления в корзину.

Следующий компонент — так называемая "малая корзина", которая отображает фразу "В вашей корзине N товаров на сумму M". Расположим его в файле `./src/scripts/main/behaviors/Basket/SmallBasket.vue`:

    <template>
        <div class="small-basket">
            <p>В вашей корзине {{ count }} товаров на сумму {{ price }} руб.</p>
            <a :href="basketUrl">В корзину</a>
        </div>
    </template>

    <script lang="js">
        export default {
            props: [ "basketUrl" ],
            data() {
                return {
                    count: 0,
                    price: 0.0
                }
            },
            methods: {
                loadData() {
                    $.get("/api/basket", response => {
                        this.count = response.count;
                        this.price = response.price;
                    });
                }
            },
            created() {
                this.loadData();
            }
        };
    </script>

Обратите внимание, что компонент сам подгружает данные при своей инициализации за счет хука `created()`.

## Создаем глобальную шину событий

Это очень просто: глобальная шина событий — это всего лишь пустой экземпляр Vue. Поместим его в файл `./src/scripts/main/EventBus.js`:

    import Vue from "vue/dist/vue.js";
    const EventBus = new Vue();
    export default EventBus;

## Использование шины событий

Прежде всего, шину событий нужно импортировать. Это делается в файлах компонентов, где она будет использоваться:

    <script lang="js">
        import EventBus from "@main/EventBus";

        // ...
    </script>

Чтобы вызвать событие, нужно воспользоваться методом `$emit(eventName, payload)`. Вызовем событие `BASKET_UPDATED` в компоненте `BuyBtn`:

    buy() {
        if (this.disabled) return;
        $.post("/api/basket/add", {product_id: this.productId});
        this.disabled = true;
        this.text = "В корзине";
        EventBus.$emit("BASKET_UPDATED", {
            action: "add",
            product_id: this.productId
        });
    }

Вторым параметром в событие можно передать любую полезную информацию. В нашем случае я передал тип события — `add`, т.е. добавление, и идентификатор товара `product_id`.

Затем нам нужно подписать компонент `SmallBasket`, чтобы он слушал это событие (не забывайте импортировать `EventBus`):

    mounted() {
        EventBus.$on("BASKET_UPDATED", payload => {
            console.log("upd", payload);
            this.loadData();
        });
    }

Полезная информация передается первым параметром в функцию-обработчик. Далее мы просто вызываем метод `loadData()`, чтобы получить с сервера актуальные данные.

Бонус такого подхода в том, что если шину событий сделать глобальной (записать в объект `window`), то пользоваться ей можно без привязки к компонентам и Vue.
Например, для обмена информацией между разными jQuery-плагинами, между jQuery-плагином и Vue-компонентом, или между отдельными js-поведениями.
