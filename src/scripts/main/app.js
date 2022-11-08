import ItcCustomSelect from "@main/select";

export default class App {

    constructor() {
        this.initEvents();
    }

    initEvents() {
        // отслеживаем клики на документе
        document.addEventListener("click", documentActions);

        //назначаем функции-обработчики в зависимости от целевого элемента
        function documentActions(e) {
            const targetElement = e.target;

            // нажатие на кнопку ...Показать ещё
            if (targetElement.classList.contains("cards__more-btn")) {
                getServiceItem(targetElement);
                e.preventDefault();
            }
            // выбор пункта в первом селекте
            if (targetElement.classList.contains("itc-select__option")) {
                if(targetElement.closest(".select-1")) {
                    changeDependSelect(targetElement);
                }
            }
            // --------->   Нажатие на кнопку "Показать"
            if (targetElement.classList.contains("button_submit")) {
                updateCardsBlock(targetElement);
            }
        }

        // --------> тут
        let chapterId, serviceId, serviceStatus;

        function updateCardsBlock(button) {
            chapterId = document.getElementById("select-1").dataset.chapter;
            serviceId = document.querySelector("#select-2 .itc-select__toggle").dataset.index;
            serviceStatus = document.querySelector("#select-3 .itc-select__toggle").dataset.index;

            //console.log("chapterId is", chapterId);
            //console.log("serviceId is", serviceId);
            //console.log("serviceStatus is",serviceStatus);

            let cardsWrapper = document.querySelector(".cards__block");
            cardsWrapper.innerHTML = "";

            getAllServiceItems(button);

            return chapterId, serviceId, serviceStatus
        }

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
                    //button.remove();
                } else {
                    alert("Ошибка");
                }
            }
        }

        function renderFilteredCard(resultData) {
            alert("Фильтруй!");
            //console.log(resultData);
            console.log("chapterId is", chapterId);
            console.log("serviceId is", serviceId);
            console.log("serviceStatus is", serviceStatus);

            const cardsBlock = document.querySelector(".cards__block");

            const whatWeHAve = resultData.services;
            console.log(whatWeHAve);
            console.log(typeof whatWeHAve); //мы имеем массив элементов. Каждый элемент массива проверяем на равенство его параметров переменным chapterId serviceId serviceStatus и наполняем и пушим только те, которые соответствуют всем трем условиям

            resultData.services.forEach(item => {
                if(serviceStatus == 2) {
                    console.log("Статус не важен, так что выводим всё");
                    if(item.chapter == chapterId && item.service == serviceId) {
                        console.log("Айди выведенной карточки", item.id);
                        // сюда пишем ссылку на функцию наполнения шаблона
                    }
                } else {
                    console.log("Статус имеет значение. Фильтруем по трем параметрам");
                    console.log("Значения переменных", chapterId, serviceId, serviceStatus);
                    console.log("Значения из json-а", item.chapter, item.service, item.status);
                    if(item.chapter == chapterId && item.service == serviceId && item.status == serviceStatus) {
                        console.log("Айди выведенной карточки", item.id);
                        // сюда пишем ссылку на функцию наполнения шаблона
                    }
                }

            })

        }

        function changeDependSelect(element) {
            let currentIndex = element.dataset.index;
            console.log("currentIndex is - индекс который мы передаем, чтобы понять, какой список вставлять в селект", currentIndex);
            console.log("element is", element)
            let dependSelect = document.getElementById("select-2");
            let selectIndex = dependSelect.dataset.selectindex;
            let selectContainer = document.getElementById("selectContainer");
            console.log("selectIndex is", selectIndex);

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
                    ["несогласие", "Несогласие на перезачет на оценку удовлетворительно (с зачет на экзамен)"],
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

        // по клику на ...Показать еще загружаем данные об услугах
        async function getServiceItem(button) {
            if(!button.classList.contains("_pushed")) {
                !button.classList.add("_pushed");
                const file = "../services.json";
                let response = await fetch (file, {
                    method: "GET"
                });
                if(response.ok) {
                    let result = await response.json();
                    //console.log(result);
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
            })
        }
    }

}




