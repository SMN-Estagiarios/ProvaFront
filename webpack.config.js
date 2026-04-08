const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
    mode: 'production',
    watch: false,
    devtool: 'source-map',
    entry: {
        izitoast: {
            import: [
                "izitoast/dist/js/iziToast.min.js",
                "izitoastcss",
            ],
            runtime: "runtime"
        },
        uikit: {
            import: [
                "uikit",
                "uikitcss",
                "uikiticonsjs"
            ],
            runtime: "runtime"
        },
        jquery: {
            import: [
                "jquery/dist/jquery.min.js"
            ],
            runtime: "runtime"
        },
        home: { import: './src/pages/home/index.ts', dependOn: ['izitoast', 'uikit', 'jquery'] }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(eot|woff(2)?|ttf|otf|svg)$/i,
                type: 'asset'
            },
            {
                test: /\.less$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "less-loader",
                ]
            },
            {
                test: /\.ico$/,
                use: 'file-loader?name=[name].[ext]'
            }
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin(),
        ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.css'],
        alias: {
            'izitoast': 'izitoast/dist/js/iziToast.min.js',
            'izitoastcss': path.resolve(__dirname, 'node_modules/izitoast/dist/css/iziToast.min.css'),
            'jquery': 'jquery/dist/jquery.min.js',
            'uikit': 'uikit/dist/js/uikit.min.js',
            'uikiticonsjs': path.resolve(__dirname, 'node_modules/uikit/dist/js/uikit-icons.min.js'),
            'uikitcss': path.resolve(__dirname, 'node_modules/uikit/dist/css/uikit.min.css'),
            '@assets': path.resolve(__dirname, 'src/assets'),
            'components': path.resolve(__dirname, 'src/components'),
            'extensions': path.resolve(__dirname, 'src/extensions'),
            'helpers': path.resolve(__dirname, 'src/helpers'),
            'styles': path.resolve(__dirname, 'src/styles')
        }
    },
    output: {
        filename: '[name].entry.js',
        path: path.resolve(__dirname, 'wwwroot', 'dist'),
        library: ['ProvaFront', '[name]'],
        libraryTarget: 'window'
    },
};
