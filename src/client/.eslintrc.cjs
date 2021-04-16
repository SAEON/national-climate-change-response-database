const path = require('path')

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  globals: {
    globalThis: false,
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
    ecmaVersion: 2021,
    sourceType: 'module',
    babelOptions: {
      configFile: path.join(__dirname, './babel.config.cjs'),
    },
  },
  plugins: ['@babel', 'react'],
  rules: {
    'react/display-name': 0,
    'react/prop-types': 0,
    'no-prototype-builtins': 0,
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    react: {
      version: require('./package.json').dependencies.react,
    },
  },
}
