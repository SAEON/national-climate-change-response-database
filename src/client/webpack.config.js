const webpack = require('webpack')
const HtmlWebPackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')
const packageJson = require('./package.json')
const fs = require('fs')
const dotenv = require('dotenv').config({ path: path.join(__dirname, './.env') })

let { NODE_ENV: mode, NCCRD_DEPLOYMENT_ENV = 'local', NCCRD_HOSTNAME = '' } = process.env

module.exports = () => {
  const output = 'dist'

  return {
    devtool: mode === 'production' ? false : false, // I haven't been able to get source maps to work nicely
    target: mode === 'production' ? ['web', 'es5'] : 'web',
    mode,
    entry: {
      index: './src/index.jsx',
    },
    output: {
      filename: '[name].[contenthash].js',
      chunkFilename: '[name].[contenthash].js',
      path: path.join(__dirname, output),
      publicPath: '/',
      assetModuleFilename: 'assets/[hash][ext][query]',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      alias: {},
    },
    optimization: {
      minimize: ['local', 'development'].includes(NCCRD_DEPLOYMENT_ENV) ? false : true,
      splitChunks: { chunks: 'all' },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: mode === 'production' ? /@babel(?:\/|\\{1,2})runtime|core-js/ : /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              envName: mode,
            },
          },
        },
        {
          test: /\.*css$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: /\.(woff|woff2|eot|ttf)$/,
          type: 'asset/resource',
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        },
        {
          test: /\.(png|jpg|gif)$/,
          type: 'asset/inline',
        },
      ],
    },
    plugins: [
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
            from: path.resolve(__dirname, './public'),
            to: path.resolve(__dirname, './dist'),
          },
        ],
      }),
      new HtmlWebPackPlugin({
        template: 'index.html',
        filename: path.join(__dirname, output, 'index.html'),
        PUBLIC_PATH: '',
        PACKAGE_DESCRIPTION: packageJson.description,
        PACKAGE_KEYWORDS: packageJson.keywords,
        PACKAGE_NAME: packageJson.name,
      }),
    ].filter(_ => _),
    devServer: {
      static: {
        staticOptions: {
          contentBase: path.join(__dirname, output),
        },
      },
      historyApiFallback: {
        disableDotRule: true,
      },
      compress: true,
    },
  }
}
