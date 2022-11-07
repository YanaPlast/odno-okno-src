const merge = require("webpack-merge");
const path = require("path");
const apiMocker = require("mocker-api");
const dotenv = require("dotenv");

const base = require("./webpack.base");

const env = dotenv.config().parsed;

module.exports = merge(base, {
    devtool: "source-map",

    devServer: {
        before(app) {
            apiMocker(app, path.resolve("./mocker/index.js"), {
                changeHost: true,
            });
        },
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        port: env.DEV_SERVER_PORT,
        writeToDisk: true,
        disableHostCheck: true,
        hot: false,
        inline: false,
        headers: {
            "Access-Control-Allow-Origin": "*",
        }
    },

    mode: "development",
});

