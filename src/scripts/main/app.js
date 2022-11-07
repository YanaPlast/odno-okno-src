export default class App {

    constructor() {
        this.initEvents();
    }

    initEvents() {
        document.addEventListener("click", documentActions);

        function documentActions(e) {
            const targetElement = e.target;

            if (targetElement.classList.contains("cards__more-btn")) {
                getServiceItem(targetElement);
                e.preventDefault();
            }

            async function getServiceItem(button) {
                if(!button.classList.contains("_pushed")) {
                    !button.classList.add("_pushed");
                    const file = "../services.json";
                    let response = await fetch (file, {
                        method: "GET"
                    });
                    if(response.ok) {
                        let result = await response.json();
                        console.log(result);
                        renderCard(result);
                        button.classList.remove("_pushed");
                        button.remove();
                    } else {
                        alert("Ошибка");
                    }
                }
            }

            function renderCard(data) {
                const cardsBlock = document.querySelector(".cards__block");
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

}




