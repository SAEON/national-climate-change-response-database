import { makeExecutableSchema } from 'graphql-tools'
import { join } from 'path'
import { readFileSync } from 'fs'
import getCurrentDirectory from '../../lib/get-current-directory.js'
import * as resolvers from '../resolvers/index.js'

const _import = p =>
  readFileSync(join(getCurrentDirectory(import.meta), p), {
    encoding: 'utf-8',
  })

const typeDefs = `${_import('./_schema.graphql')}`

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  inheritResolversFromInterfaces: true,
})

export default schema
