const webpack = require('webpack')
module.exports = {
    // devtool: 'hidden-source-map',
    entry: {
        libs: [
            'react-router-dom',
            'babel-polyfill',
            'react-responsive-carousel',
            'redux',
            'redux-saga',

            'echarts-for-react',
            'react-infinite-scroller',
            'react-highlight-words',
            'ramda',

            'jquery',
            'viser-react',
            'echarts',
            'antd',
            '@antv/data-set',
            '@ant-design/icons',
            '@ant-design/compatible',
            'xlsx'
        ]
    },
    output: {
        publicPath: '/',
        filename: '../dll/[name].dll.js',
        library: '[name]_dll_[hash]',
    },
    plugins: [
        new webpack.DllPlugin({
            context: __dirname,
            path: 'dll/[name].manifest.json',
            name: '[name]_dll_[hash]',
            format: true,
        })
    ]
};