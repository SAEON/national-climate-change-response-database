const webpack = require('webpack')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')
const packageJson = require('../package.json')
const loadEntryPoints = require('./load-entry-points.js')

const ROOT = path.normalize(path.join(__dirname, '../'))
const dotenv = require('dotenv').config({ path: path.join(ROOT, './.env') })
const {
  NODE_ENV: mode,
  DEPLOYMENT_ENV = 'local',
  HOSTNAME = '',
  DEFAULT_TENANT_ADDRESS,
} = process.env

module.exports = (ROOT, output) => {
  return [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(mode),
        DEPLOYMENT_ENV: JSON.stringify(DEPLOYMENT_ENV),
        HOSTNAME: JSON.stringify(HOSTNAME),
        DEFAULT_TENANT_ADDRESS: JSON.stringify(DEFAULT_TENANT_ADDRESS),
        PACKAGE_NAME: JSON.stringify(packageJson.name),
        PACKAGE_DESCRIPTION: JSON.stringify(packageJson.description),
        PACKAGE_KEYWORDS: JSON.stringify(packageJson.keywords),
        ...Object.fromEntries(
          Object.entries(dotenv.parsed || {})
            .filter(([key]) => key !== 'DEPLOYMENT_ENV')
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
