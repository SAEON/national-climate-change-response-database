const path = require('path')
const fs = require('fs')
const configureRules = require('./rules.js')
const loadAliases = require('./load-aliases.js')
const configureDevServer = require('./dev-server')
const configurePlugins = require('./plugins.js')

const ROOT = path.normalize(path.join(__dirname, '../'))

require('dotenv').config({ path: path.join(ROOT, './.env') })

const { NODE_ENV: mode, DEPLOYMENT_ENV = 'local' } = process.env

const entries = Object.fromEntries(
  fs
    .readdirSync(path.join(ROOT, 'src/entry-points'))
    .filter(name => fs.lstatSync(path.join(ROOT, `src/entry-points/${name}`)).isDirectory())
    .map(name => [name, path.join(ROOT, `src/entry-points/${name}/index.jsx`)])
)

module.exports = () => {
  const output = 'dist'

  return {
    devtool: mode === 'production' ? false : false, // I haven't been able to get source maps to work nicely
    target: 'browserslist',
    mode,
    entry: entries,
    output: {
      filename: '[name].[contenthash].js',
      chunkFilename: '[name].[contenthash].js',
      path: path.join(ROOT, output),
      publicPath: '/',
      assetModuleFilename: 'assets/[hash][ext][query]',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: loadAliases(ROOT, mode),
    },
    optimization: {
      minimize: DEPLOYMENT_ENV === 'local' ? false : true,
      splitChunks: { chunks: 'all' },
    },
    module: {
      rules: configureRules(mode),
    },
    plugins: configurePlugins(ROOT, output),
    devServer: configureDevServer(ROOT, output),
  }
}
