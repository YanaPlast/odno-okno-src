import "@styles/main.scss";

import ItcCustomSelect from "@main/select";
//window.ItcCustomSelect = new ItcCustomSelect();

let select1 = new ItcCustomSelect("#select-1", {
    name: "questions",
    targetValue: "вопросы",
    options: [
        ["вопросы", "Вопросы учебы и образования"],
        ["общее", "Общие вопросы"]
    ]
});

let select2 = new ItcCustomSelect("#select-2", {
    name: "service",
    targetValue: "перезачёты",
    options: [
        ["перезачёты", "Перезачеты"],
        ["несогласие", "Несогласие на перезачет на оценку удовлетворительно (с зачет на экзамен)"],
        ["вопросы", "Вопросы по перезачету"]
    ]
});

let select3 = new ItcCustomSelect("#select-3", {
    name: "не важно",
    targetValue: "не важно",
    options: [
        ["онлайн", "Доступно онлайн"],
        ["лично", "Только лично"],
        ["не важно", "Не важно"],
    ]
});


window.selectOne = select1;
window.selectTwo = select2;
window.selectThree = select3;

import App from "@main/app";
window.App = new App();
