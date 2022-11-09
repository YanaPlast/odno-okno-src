import ItcCustomSelect from "@main/select";

export default class App {

    constructor() {
        this.initEvents();
    }

    initEvents() {
        // отслеживаем клики на документе
        document.addEventListener("click", documentActions);

        //назначаем функции-обработчики элементам
        function documentActions(e) {
            const targetElement = e.target;

            // выбор пункта в первом селекте
            if (targetElement.classList.contains("itc-select__option")) {
                if(targetElement.closest(".select-1")) {
                    changeDependSelect(targetElement);
                }
            }
            // Нажатие на кнопку "Показать"
            if (targetElement.classList.contains("button_submit")) {
                updateCardsBlock(targetElement);
            }

            // нажатие на кнопку ...Показать ещё
            if (targetElement.classList.contains("cards__more-btn")) {
                getServiceItem(targetElement);
            }
        }

        // по клику на селект с разделами меняем список услуг в селекте с услугами
        function changeDependSelect(element) {
            let currentIndex = element.dataset.index;
            let dependSelect = document.getElementById("select-2");
            let selectContainer = document.getElementById("selectContainer");

            if(currentIndex === "1") {
                element.closest(".select-1").dataset.chapter = "1";

                let selectedItem = "документы";
                let newListItems = [
                    ["документы", "Документы"],
                    ["статус", "Статус в реестре студентов"],
                    ["отчет", "Отчет по практике"]
                ];
                updateDependSelect(selectedItem, newListItems);
            }

            if(currentIndex === "0") {
                element.closest(".select-1").dataset.chapter = "0";
                let selectedItem = "перезачёты";
                let newListItems = [
                    ["перезачёты", "Перезачеты"],
                    ["несогласие", "Несогласие на перезачет на оценку удовлетворительно (с зачета на экзамен)"],
                    ["вопросы", "Вопросы по перезачету"]
                ];
                updateDependSelect(selectedItem, newListItems);
            }

            function updateDependSelect(item, options) {
                dependSelect.remove();
                selectContainer.insertAdjacentHTML("beforeend", `
                <div class="select filter__select" id="select-2" data-selectIndex="1"></div>
                `);

                new ItcCustomSelect("#select-2", {
                    targetValue: item,
                    name: "service",
                    options: options
                });

            }
        }

        // получаем выбранные в селектах параметры поиска услуг
        let chapterId, serviceId, serviceStatus;

        function updateCardsBlock(button) {
            chapterId = document.getElementById("select-1").dataset.chapter;
            serviceId = document.querySelector("#select-2 .itc-select__toggle").dataset.index;
            serviceStatus = document.querySelector("#select-3 .itc-select__toggle").dataset.index;

            let cardsWrapper = document.querySelector(".cards__block");
            cardsWrapper.innerHTML = "";

            getAllServiceItems(button);

            return chapterId, serviceId, serviceStatus
        }

        // получаем объект с услугами
        async function getAllServiceItems(button) {
            if(!button.classList.contains("_pushed")) {
                !button.classList.add("_pushed");
                const file = "../services.json";
                let response = await fetch (file, {
                    method: "GET"
                });
                if(response.ok) {
                    let result = await response.json();
                    renderFilteredCard(result);
                    button.classList.remove("_pushed");
                } else {
                    alert("Ошибка");
                }
            }
        }

        // выбираем из всех услуг услуги, подходящие под условия поиска
        function renderFilteredCard(resultData) {
            const cardsBlock = document.querySelector(".cards__block");
            resultData.services.forEach(item => {
                if(serviceStatus == 2) {
                    // онлайн или лично - не имеет значения, значит выбираем только по двум параметрам
                    if(item.chapter == chapterId && item.service == serviceId) {
                        insertDataToTemplate(item, cardsBlock);
                    }
                } else {
                    if(item.chapter == chapterId && item.service == serviceId && item.status == serviceStatus) {
                        insertDataToTemplate(item, cardsBlock);
                    }
                }
            })
            // если ни одна услуга не подошла под параметры поиска - выводим сообщение
            if(cardsBlock.querySelectorAll(".card").length < 1) {
                cardsBlock.insertAdjacentHTML("beforeend", `
                            <div class="warning">
                                <p class="warning__title">Услуг не найдено.
                                Попробуйте изменить параметры поиска.</p>
                            </div>
                        `)
            }

            if(document.querySelector(".cards__more-btn")) {
                document.querySelector(".cards__more-btn").innerHTML = "Показать все услуги";
            } else {
                document.querySelector(".cards__more").insertAdjacentHTML("beforeend", `
                    <button type="submit" class="button cards__more-btn">Показать все услуги</button>
                `)
            }
        }

        // по клику на "...Показать еще" загружаем данные об услугах
        async function getServiceItem(button) {
            if(!button.classList.contains("_pushed")) {
                !button.classList.add("_pushed");
                const file = "../services.json";
                let response = await fetch (file, {
                    method: "GET"
                });
                if(response.ok) {
                    let result = await response.json();
                    renderCard(result);
                    button.classList.remove("_pushed");
                    button.remove();
                } else {
                    alert("Ошибка");
                }
            }
        }

        // из полученных данных собираем карточки
        function renderCard(data) {
            const cardsBlock = document.querySelector(".cards__block");
            cardsBlock.innerHTML = "";
            data.services.forEach(item => {
                insertDataToTemplate(item, cardsBlock);
            })
        }

        //функция наполнения шаблона
        function insertDataToTemplate(item, cardsBlock) {
            const serviceId = item.id;
            const serviceSphere = item.dataSphere;
            const serviceService = item.dataService;
            const serviceTitle = item.title;
            const serviceText = item.text;
            const serviceLabel = item.label;
            const serviceTagColor = item.labelClass;
            const serviceButtons = item.buttons;

            let cardTemplate = "";
            let cardTemplateStart = `
                                        <div class="cards__item card" data-id="${serviceId}" data-sphere="${serviceSphere}" data-service="${serviceService}">    
                                        `;
            let cardTemplateEnd = "</div>";
            let cardTemplateTop = `
                        <div class="card__tag ${serviceTagColor}">${serviceLabel}</div>
                        <div class="card__title">${serviceTitle}</div>
                        <div class="card__text">${serviceText}</div>
                    `;

            let cardTemplateBottom = "";

            if(serviceButtons) {
                let cardTemplateBottomStart = "<div class='card__buttons'>";
                let cardTemplateBottomEnd = "</div>"
                let cardTemplateBottomContent = "";

                if(serviceButtons.length === 1) {
                    serviceButtons.forEach(button => {
                        cardTemplateBottomContent += `<a href="${button.url}" class="button button_action ${button.class} button_single">
                                ${button.svg}
                                <span>${button.text}</span>
                               </a>
                                `;
                    });
                } else {
                    serviceButtons.forEach(button => {
                        cardTemplateBottomContent += `<a href="${button.url}" class="button button_action ${button.class}">
                                ${button.svg}
                                <span>${button.text}</span>
                               </a>
                                `;
                    });
                }

                cardTemplateBottom += cardTemplateBottomStart;
                cardTemplateBottom += cardTemplateBottomContent;
                cardTemplateBottom += cardTemplateBottomEnd;
            }

            cardTemplate += cardTemplateStart;
            cardTemplate += cardTemplateTop;
            cardTemplate += cardTemplateBottom;
            cardTemplate += cardTemplateEnd;

            cardsBlock.insertAdjacentHTML("beforeend", cardTemplate);
        }

        // показать ещё текст в мобильном виде
        const mql = window.matchMedia("(max-width: 575.98px)");
        const textBlock = document.querySelector(".main-info__text");

        let event_list = ["load", "resize"];

        event_list.forEach(function(event) {
            window.addEventListener(event, function() {
                if(mql.matches) {
                    textBlock.addEventListener("click", openCloseMore);
                } else {
                    textBlock.removeEventListener("click", openCloseMore);
                }
            });
        });

        function openCloseMore() {
            if(textBlock.classList.contains("_opened")) {
                textBlock.classList.remove("_opened");
            } else {
                textBlock.classList.add("_opened");
            }
        }

    }
}




