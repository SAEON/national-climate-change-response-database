module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: ['eslint:recommended'],
  globals: {
    globalThis: false,
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    ecmaFeatures: {
      modules: true,
    },
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  plugins: ['@babel'],
  rules: {
    'no-prototype-builtins': 0,
  },
}
