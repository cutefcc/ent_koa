// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
//   .BundleAnalyzerPlugin
const setIterm2Badge = require('set-iterm2-badge')
const plugins = []
setIterm2Badge('人才银行🏦')
module.exports = {
  devtool: 'source-map',
  output: {
    filename: 'ent/[name].bundles.js',
    publicPath: '/',
  },
  plugins,
}
