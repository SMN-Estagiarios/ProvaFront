const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: "production",
    devtool: "source-map",
    entry: {
        izitoast: {
            import: "./src/components/toast.ts",
            runtime: "runtime",
        },

        uikit: {
            import: "./src/components/uikit.ts",
            runtime: "runtime",
        },

        jquery: {
            import: "./src/components/jquery.ts",
            runtime: "runtime",
        },

        home: {
            import: "./src/pages/home/index.ts",
            dependOn: ["izitoast", "uikit", "jquery"],
        },
    },
    module: {
        rules: [
            { test: /\.ts$/, use: "ts-loader", exclude: /node_modules/ },
            { test: /\.css$/, use: ["style-loader", "css-loader"] },
            {
                test: /\.less$/i,
                use: ["style-loader", "css-loader", "less-loader"],
            },
            { test: /\.(eot|woff(2)?|ttf|otf|svg)$/i, type: "asset" },
            { test: /\.ico$/, use: "file-loader?name=[name].[ext]" },
        ],
    },
    resolve: {
        extensions: [".ts", ".js", ".css"],
        alias: {
            components: path.resolve(__dirname, "src/components"),
            helpers: path.resolve(__dirname, "src/helpers"),
            styles: path.resolve(__dirname, "src/styles"),
        },
    },
    optimization: {
        runtimeChunk: "single",
        minimize: true,
        minimizer: [new TerserPlugin()],
    },
    output: {
        filename: "[name].entry.js",
        path: path.resolve(__dirname, "wwwroot/dist"),
        library: ["ProvaFront", "[name]"],
        libraryTarget: "window",
    },
};
