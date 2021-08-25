import { makeExecutableSchema } from '@graphql-tools/schema'
import { graphqlSync } from 'graphql'
import { print } from 'graphql/language/printer.js'
import { gql } from 'apollo-server-koa'
import { join } from 'path'
import { readFileSync, readdirSync } from 'fs'
import getCurrentDirectory from '../../lib/get-current-directory.js'
import * as resolvers from '../resolvers/index.js'
import {
  projectVocabularyFields as _projectVocabularyFields,
  mitigationVocabularyFields as _mitigationVocabularyFields,
  adaptationVocabularyFields as _adaptationVocabularyFields,
} from './vocabulary-fields.js'

const __dirname = getCurrentDirectory(import.meta)

const _import = p =>
  readFileSync(join(getCurrentDirectory(import.meta), p), {
    encoding: 'utf-8',
  })

const SCHEMA_PARTS = readdirSync(join(__dirname, './type-defs'))
const typeDefs = SCHEMA_PARTS.map(name => `${_import(`./type-defs/${name}`)}`).join('\n')
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  inheritResolversFromInterfaces: true,
})

console.info('Building input type fields list from GraphQL schema')
const typeFields = graphqlSync(
  schema,
  print(
    gql`
      query {
        p: __type(name: "ProjectInput") {
          inputFields {
            name
            type {
              kind
            }
          }
        }
        m: __type(name: "MitigationInput") {
          inputFields {
            name
            type {
              kind
            }
          }
        }
        a: __type(name: "AdaptationInput") {
          inputFields {
            name
            type {
              kind
            }
          }
        }
      }
    `
  )
).data

export const projectVocabularyFields = _projectVocabularyFields
export const mitigationVocabularyFields = _mitigationVocabularyFields
export const adaptationVocabularyFields = _adaptationVocabularyFields
export const projectInputFields = Object.fromEntries(
  typeFields.p.inputFields.map(({ name, type: { kind } }) => [name, kind])
)
export const mitigationInputFields = Object.fromEntries(
  typeFields.m.inputFields.map(({ name, type: { kind } }) => [name, kind])
)
export const adaptationInputFields = Object.fromEntries(
  typeFields.a.inputFields.map(({ name, type: { kind } }) => [name, kind])
)

export default schema
