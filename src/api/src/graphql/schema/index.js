import { makeExecutableSchema } from 'graphql-tools'
import { join } from 'path'
import { readFileSync, readdirSync } from 'fs'
import getCurrentDirectory from '../../lib/get-current-directory.js'
import * as resolvers from '../resolvers/index.js'

const __dirname = getCurrentDirectory(import.meta)

const SCHEMA_PARTS = readdirSync(join(__dirname, './type-defs'))

const _import = p =>
  readFileSync(join(getCurrentDirectory(import.meta), p), {
    encoding: 'utf-8',
  })

const typeDefs = SCHEMA_PARTS.map(name => `${_import(`./type-defs/${name}`)}`).join('\n')

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  inheritResolversFromInterfaces: true,
})

export default schema
