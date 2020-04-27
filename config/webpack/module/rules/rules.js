const ignoredGSAPFiles = ['BezierPlugin', 'DirectionalRotationPlugin', 'RoundPropsPlugin'],
    path = require("path");

module.exports = [
    {
        test: /\.js$/,
        include: ignoredGSAPFiles.map(fileName => path.resolve('node_modules/gsap/' + fileName)),
        loader: 'null-loader',
    },
    {
        test: /\.js$/,
        loader: "babel-loader",
        query: {
            "presets": [
                "@babel/preset-env"
            ]
        },
        exclude: /^.*node_modules((?!dom7|ssr-window|swiper).)*$/,
    },
    {
        test: /\.ts$/,
        loader: "ts-loader",
        // exclude: /node_modules/,
    },
    {
        test: /\.css$/,
        // loader: "css-loader",
        use: [
            {
                loader: "style-loader"
            },
            {
                loader: "css-loader",
                options: {
                    minimize: true,
                }
            }
        ]
    }
]