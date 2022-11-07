const merge = require("webpack-merge");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const base = require("./webpack.base");

module.exports = merge(base, {
    devtool: false,

    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
            }),
            new OptimizeCssAssetsPlugin({})
        ],
    },
});
