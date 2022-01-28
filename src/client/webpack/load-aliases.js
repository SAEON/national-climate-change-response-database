const path = require('path')

module.exports = (ROOT, mode) => ({
  /**
   * Webpack doesn't seem to respect the package.json
   * exports field. That is why saeon packages are
   * referenced by dist folder, and not just the
   * package
   */

  // clsx
  clsx: path.resolve(ROOT, './node_modules/clsx'),

  // Apollo
  '@apollo/client': path.resolve(ROOT, './node_modules/@apollo/client'),

  // Material UI
  '@mui/material': path.resolve(ROOT, './node_modules/@mui/material'),
  '@mui/icons-material': path.resolve(ROOT, './node_modules/@mui/icons-material'),

  // React
  react: path.resolve(ROOT, './node_modules/react'),
  'react-dom': path.resolve(ROOT, './node_modules/react-dom')
})
