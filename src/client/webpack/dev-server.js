const path = require('path')
const fs = require('fs')

module.exports = (ROOT, output) => {
  const rewrites = fs
    .readdirSync(path.join(ROOT, 'src/entry-points'))
    .filter(name => fs.lstatSync(path.join(ROOT, `src/entry-points/${name}`)).isDirectory())
    .sort(name => (name === 'index' ? 1 : -1))
    .map(name => {
      if (name === 'index') {
        return { from: new RegExp('.'), to: '/index.html' }
      }

      return { from: new RegExp(`^${'\\'}/${name}`), to: `/${name}.html` }
    })

  return {
    bonjour: false,
    http2: false, // NOTE - if this is true then the API needs to also be https for dev on local (I don't know how)
    host: 'localhost',
    open: ['http://localhost:3001'],
    allowedHosts: 'all',
    static: {
      directory: path.join(ROOT, output),
    },
    historyApiFallback: {
      verbose: true,
      disableDotRule: false,
      rewrites,
    },
    compress: true,
  }
}
