const webpack = require('webpack')
const path = require('path')
let argv = require('yargs-parser')(process.argv.slice(2))
const { merge } = require('webpack-merge')
const _mode = argv.mode || 'development'
const _modeflag = _mode === 'development' ? false : true
const _mergeConfig = require(`./config/webpack.${_mode}.js`)
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
// const HappyPack = require('happypack')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const os = require('os')
const WebpackBar = require('webpackbar')
// const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
// const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')
// const PrerenderSPAPlugin = require('prerender-spa-plugin')
// const SentryCliPlugin = require('@sentry/webpack-plugin')
const childProcess = require('child_process')
const commitHash = childProcess
  .execSync('git rev-parse --short HEAD')
  .toString()
// const happyThreadPoll = HappyPack.ThreadPool({ size: os.cpus().length })
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const args = process.argv.slice(1)

const currentStat = args[2]

const plugins = [
  new HtmlWebpackPlugin({
    title: 'recruit-fe',
    template: './src/index.html',
    filename: path.join(__dirname, '/dist/index.html'),
    // inlineSource: '.(js|css)$',
  }),
  // new InlineManifestWebpackPlugin(),
  // new HtmlWebpackInlineSourcePlugin(),
  new CleanWebpackPlugin(),
  // new HappyPack({
  //   id: 'happyBabel',
  //   threadPool: happyThreadPoll,
  //   verbose: true,
  //   loaders: [
  //     {
  //       loader: 'babel-loader',
  //       options: {
  //         presets: ['@babel/preset-env'],
  //       },
  //     },
  //   ],
  // }),
  new WebpackBar(),
  // new ProgressBarPlugin(),
  new FriendlyErrorsWebpackPlugin(),
  new webpack.DllReferencePlugin({
    context: __dirname,
    manifest: require('./dll/libs.manifest.json'),
  }),
  // 适用于内容是静态的——没有即时性要求的页面，可以考虑给某些页面加
  // new PrerenderSPAPlugin({
  //   staticDir: path.join(__dirname, 'dist'),
  //   routes: ['/ent/v3/index'],
  // }),
  new CopyPlugin({
    patterns: [
      { from: 'public', to: path.join(__dirname, '/dist') },
      { from: 'dll', to: path.join(__dirname, '/dist') },
    ],
  }),
]
if (currentStat === '--unstable') {
  plugins.push(new HardSourceWebpackPlugin())
}
// if (_modeflag) {
//   plugins.push(
//     new SentryCliPlugin({
//       release: `recruit-fe@${commitHash}`,
//       include: './dist/ent',
//       urlPrefix: 'https://maimai.cn/ent',
//       ignoreFile: '.sentrycliignore',
//       ignore: ['node_modules', 'webpack.config.*.js'],
//       configFile: 'sentry.properties',
//       setCommits: commitHash,
//     })
//   )
// }

let webpackConfig = {
  entry: {
    index: './src/index.js',
    qiniu: './public/static/scripts/upload/qiniu.min.js',
    mmEntUi: './src/mmEntUi/index.js',
  },
  watch: !_modeflag,
  devServer: {
    hot: true,
    host: currentStat === '--use-local-ip' ? '0.0.0.0' : 'localhost',
    port: 8007,
    contentBase: './dist',
    historyApiFallback: true,
    proxy: _modeflag ? {} : require('./local'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          'cache-loader',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
            },
          },
          {
            loader: 'thread-loader',
            options: {
              workers: os.cpus().length,
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ['cache-loader', 'style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        use: [
          'cache-loader',
          'babel-loader',
          {
            loader: 'thread-loader',
            options: {
              workers: os.cpus().length,
            },
          },
        ],
        exclude: /(node_modules|bower_components)/,
        // include: path.resolve(__dirname, 'src'),
      },
      {
        test: /\.less$/,
        use: [
          'cache-loader',
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              // sourceMap: true,
              modules: {
                localIdentName: '[local]___[hash:base64:5]',
                // localIdentName: "[path][name]__[local]--[hash:base64:5]",
              },
            },
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                // strictMath: true,
                javascriptEnabled: true,
                // sourceMap: true,
              },
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        enforce: 'pre',
        use: {
          loader: 'eslint-loader',
        },
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          'cache-loader',
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  plugins,
  resolve: {
    alias: {
      static: path.resolve(__dirname, './src/static'),
      components: path.resolve(__dirname, './src/components'),
      constants: path.resolve(__dirname, './src/constants'),
      store: path.resolve(__dirname, './src/store'),
      utils: path.resolve(__dirname, './src/utils'),
      common: path.resolve(__dirname, './src/common'),
      src: path.resolve(__dirname, './src'),
      assets: path.resolve(__dirname, './src/assets'),
      componentsV2: path.resolve(__dirname, './src/componentsV2'),
      componentsV3: path.resolve(__dirname, './src/componentsV3'),
      layouts: path.resolve(__dirname, './src/layouts'),
      models: path.resolve(__dirname, './src/models'),
      routes: path.resolve(__dirname, './src/routes'),
      routesV2: path.resolve(__dirname, './src/routesV2'),
      routesV3: path.resolve(__dirname, './src/routesV3'),
      services: path.resolve(__dirname, './src/services'),
      utils: path.resolve(__dirname, './src/utils'),
      indexStyle: path.resolve(__dirname, './src/index.less'),
      images: path.resolve(__dirname, './src/images'),
      voyager: path.resolve(__dirname, './src/utils/voyager/index'),
      mmEntUi: path.resolve(__dirname, './src/mmEntUi'),
      middleware: path.resolve(__dirname, './src/middleware'),
      'mm-ent-ui': path.resolve(__dirname, './src/mmEntUi'),
      qiniu: path.resolve(
        __dirname,
        './public/static/scripts/upload/qiniu.min.js'
      ),
    },
    extensions: [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      '.js',
      '.json',
      '.jsx',
      '.ts',
      '.tsx',
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        common: {
          name: 'common',
          chunks: 'all',
          minChunks: 2,
          priority: 10,
        },
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true,
        },
      },
    },
    runtimeChunk: 'single',
  },
}
const externalConfig = {}
if (currentStat === 'debugger') {
  externalConfig.devtool = 'source-map'
}
module.exports = merge(_mergeConfig, webpackConfig, externalConfig)
