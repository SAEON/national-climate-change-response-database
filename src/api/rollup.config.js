import json from '@rollup/plugin-json'
import { nodeResolve } from '@rollup/plugin-node-resolve'

const external = [
  '@graphql-tools/schema',
  '@koa/router',
  'apollo-server-core',
  'apollo-server-koa',
  'base64url',
  'csv',
  'csv/sync',
  'dataloader',
  'date-fns',
  'dotenv',
  'dotenv/config',
  'fs',
  'fs/promises',
  'graphql-tools',
  'graphql-type-json',
  'graphql',
  'graphql/language/printer.js',
  'http',
  'koa-bodyparser',
  'koa-compress',
  'koa-mount',
  'koa-passport',
  'koa-session',
  'koa-static',
  'koa',
  'koa2-formidable',
  'mssql',
  'nanoid',
  'node-fetch',
  'object-hash',
  'openid-client',
  'path',
  'perf_hooks',
  'sanitize-filename',
  'sift',
  'sql-formatter',
  'stream',
  'url',
  'wkt',
  'xlsx-populate',
  'zlib',
]

export default [
  {
    input: 'src/index.js',
    preserveEntrySignatures: false,
    external,
    output: {
      dir: 'bin',
      format: 'cjs',
    },
    plugins: [
      nodeResolve({
        modulesOnly: true,
      }),
      json(),
    ],
  },
]
