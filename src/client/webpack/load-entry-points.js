const HtmlWebPackPlugin = require('html-webpack-plugin')
const path = require('path')
const fs = require('fs')

module.exports = (ROOT, output) => {
  const entries = fs.readdirSync(path.join(ROOT, 'src/entry-points'))
  return entries
    .filter(name => fs.lstatSync(path.join(ROOT, `src/entry-points/${name}`)).isDirectory())
    .map(
      name =>
        new HtmlWebPackPlugin({
          template: path.join(ROOT, `src/entry-points/${name}/index.html`),
          filename: path.join(ROOT, output, `${name}.html`),
          PUBLIC_PATH: '',
          chunks: [name],
        })
    )
}
