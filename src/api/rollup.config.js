import json from '@rollup/plugin-json'

export default {
  input: 'src/index.js',
  output: {
    file: 'bin/index.cjs',
    format: 'cjs',
  },
  plugins: [json()],
}
