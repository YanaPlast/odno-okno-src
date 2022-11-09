import "@styles/main.scss";

import ItcCustomSelect from "@main/select";

new ItcCustomSelect("#select-1", {
    name: "questions",
    targetValue: "вопросы",
    options: [
        ["вопросы", "Вопросы учебы и образования"],
        ["общее", "Общие вопросы"]
    ]
});

new ItcCustomSelect("#select-2", {
    name: "service",
    targetValue: "перезачёты",
    options: [
        ["перезачёты", "Перезачеты"],
        ["несогласие", "Несогласие на перезачет на оценку удовлетворительно (с зачета на экзамен)"],
        ["вопросы", "Вопросы по перезачету"]
    ]
});

new ItcCustomSelect("#select-3", {
    name: "не важно",
    targetValue: "не важно",
    options: [
        ["онлайн", "Доступно онлайн"],
        ["лично", "Только лично"],
        ["не важно", "Не важно"],
    ]

});

import App from "@main/app";
window.App = new App();
