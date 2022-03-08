module.exports = mode => {

  return [
    {
      test: /\.(js|jsx|ts|tsx|cjs|mjs)$/,
      exclude: mode === 'production' ? /@babel(?:\/|\\{1,2})runtime|core-js/ : /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          envName: mode,
          babelrc: false,
          cacheDirectory: true
        },
      },
    },
    {
      test: /\.*css$/,
      use: ['style-loader', 'css-loader'],
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
  ]
}
