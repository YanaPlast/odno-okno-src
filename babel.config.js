module.exports = {
    "presets": [
        ["@babel/env", {
            modules: "commonjs",
            corejs: 3,
            useBuiltIns: "usage",
        }],
        ["@babel/react"],
        [require("./babel.preset.pre-typescript")],
        ["babel-preset-typescript-vue", {
            allowDeclareFields: true,
        }],
        [require("./babel.preset.post-typescript")],
    ],
    "plugins": ["add-module-exports"],
};
