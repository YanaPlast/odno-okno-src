const {resolve} = require("path");
const webpack = require("webpack");
const fs = require("fs");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ExtraWatchWebpackPlugin = require("extra-watch-webpack-plugin");
const NunjucksWebpackPlugin = require("nunjucks-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const dotenv = require("dotenv");

const env = dotenv.config().parsed;

const files = [
    "routes.local.js",
    "routes.js",
];

const routes = files.reduce((acc, file) => {
    if (acc) {
        return acc;
    }

    if (fs.existsSync(`${file}`)) {
        return require(`./${file}`);
    }
}, false);

if (!routes) {
    throw new Error("Роуты не загружены.");
}

const config = {
    context: resolve(__dirname, "src"),

    entry: {
        "main": [
            "./main.js",
        ],
    },

    module: {
        rules: [
            {
                test: /\.(png|jpg)$/,
                use: "url-loader?limit=15000",
            },
            {
                test: /\.svg$/,
                loader: "url-loader?limit=65536&mimetype=image/svg+xml&name=fonts/[name].[ext]",
            },
            {
                test: /\.woff$/,
                loader: "url-loader?limit=65536&mimetype=application/font-woff&name=fonts/[name].[ext]",
            },
            {
                test: /\.woff2$/,
                loader: "url-loader?limit=65536&mimetype=application/font-woff2&name=fonts/[name].[ext]",
            },
            {
                test: /\.[ot]tf$/,
                loader: "url-loader?limit=65536&mimetype=application/octet-stream&name=fonts/[name].[ext]",
            },
            {
                test: /\.eot$/,
                loader: "url-loader?limit=65536&mimetype=application/vnd.ms-fontobject&name=fonts/[name].[ext]",
            },
            {
                test: /\.[tj]sx?$/,
                use: [
                    {
                        loader: "babel-loader",
                    }
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "css-loader",
                        options: {
                            url: false,
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: [
                                require("autoprefixer")
                            ]
                        }
                    },
                    {
                        loader: "sass-loader",
                    },
                ],
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "css-loader",
                        options: {
                            url: false,
                        },
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            plugins: [
                                require("autoprefixer")
                            ]
                        }
                    },
                    {
                        loader: "less-loader",
                    },
                ],
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader", "postcss-loader"],
            },
            {
                test: /\.vue$/,
                loader: "vue-loader"
            }
        ],
    },

    output: {
        filename: "js/[name].js",
    },

    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    enforce: true,
                    chunks: "all"
                }
            }
        }
    },

    plugins: [
        new CleanWebpackPlugin({
            root: resolve(__dirname, "."),
            verbose: true,
            dry: false,
            cleanStaleWebpackAssets: false,
        }),

        new CopyWebpackPlugin(
            [
                {
                    from: resolve("./src/assets"),
                    to: resolve("./dist/"),
                },
            ]
        ),

        new ExtraWatchWebpackPlugin({
            dirs: ["src/pages"],
        }),

        new MiniCssExtractPlugin({
            filename: "css/[name].css",
            chunkFilename: "css/[id].css",
        }),

        new NunjucksWebpackPlugin({
            templates: fs.readdirSync(resolve(__dirname, "./src/pages"))
                .reduce((acc, file) => {
                    const matches = file.match(/^([a-zA-Z0-9][a-zA-Z0-9_-]+)\.njk/);

                    if (matches) {
                        return [...acc, {
                            from: `./src/pages/${file}`,
                            to: `./${matches[1]}.html`,
                            context: {
                                routes,
                            }
                        }];
                    }

                    return acc;
                }, []),

            writeToFileEmit: true,

            configure: {},
        }),

        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery" // Необходимо для работы некоторых плагинов (напр. FancyBox 3)
        }),

        new VueLoaderPlugin(),

        // new BundleAnalyzerPlugin(),

        new webpack.DefinePlugin({
            "process.env": JSON.stringify(env),
            ...Object.keys(routes).reduce((acc, route) => ({...acc, [`routes.${route}`]: `"${routes[route]}"`}), {}),
        }),
    ],

    resolve: {
        modules: [
            "node_modules",
        ],

        alias: {
            "@main": resolve(__dirname, "src/scripts/main"),
            "@std": resolve(__dirname, "src/scripts/std"),
            "@styles": resolve(__dirname, "src/styles"),
            "vue": "vue/dist/vue.esm.js",
        },

        extensions: [".js", ".jsx", ".ts", ".tsx", ".css", ".scss", ".less", ".vue", ".json"],
    },

    mode: env.NODE_ENV,
};

module.exports = config;
