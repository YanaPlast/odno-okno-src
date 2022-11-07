module.exports = () => {
    return {
        plugins: [
            ["@babel/proposal-object-rest-spread"],
            ["@babel/plugin-proposal-optional-chaining"],
            ["@babel/plugin-proposal-nullish-coalescing-operator"],
        ]
    };
}
