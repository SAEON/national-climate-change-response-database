const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')
const dotenv = require('dotenv').config({ path: path.join(__dirname, './.env') })
const packageJson = require('../package.json')
const loadEntryPoints = require('./load-entry-points.js')

const { NODE_ENV: mode, NCCRD_DEPLOYMENT_ENV = 'local', NCCRD_HOSTNAME = '' } = process.env

module.exports = (ROOT, output) => {
  return [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        NCCRD_DEPLOYMENT_ENV: JSON.stringify(NCCRD_DEPLOYMENT_ENV),
        NCCRD_HOSTNAME: JSON.stringify(NCCRD_HOSTNAME),
        PACKAGE_NAME: JSON.stringify(packageJson.name),
        PACKAGE_DESCRIPTION: JSON.stringify(packageJson.description),
        PACKAGE_KEYWORDS: JSON.stringify(packageJson.keywords),
        ...Object.fromEntries(
          Object.entries(dotenv.parsed || {})
            .filter(([key]) => key !== 'NCCRD_DEPLOYMENT_ENV')
            .map(([key, value]) => [key, JSON.stringify(value)])
        ),
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(ROOT, './public'),
          to: path.resolve(ROOT, './dist'),
        },
      ],
    }),
    ...loadEntryPoints(ROOT, output),
  ].filter(_ => _)
}
