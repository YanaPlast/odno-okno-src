const fs = require("fs");

require("dotenv").config();

/* Документация https://github.com/jaywcjlove/mocker-api#readme */
/* Можно менять методы отправки, добавлять задержку (delay) и проч. */

const files = [
    "routes.local.js",
    "routes.js",
];

const routes = files.reduce((acc, file) => {
    if (acc) {
        return acc;
    }

    if (fs.existsSync(`${file}`)) {
        return require(`../${file}`);
    }
}, false);

if (!routes) {
    throw new Error("Роуты не загружены.");
}

const example = require("./example");

const config = {
    header: {
        "Access-Control-Allow-Origin": "*",
    },

    // пример
    [`GET ${routes.example}`]: example.get,
}

module.exports = config;
