import { makeExecutableSchema } from '@graphql-tools/schema'
import { graphqlSync, print } from 'graphql'
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
})

console.info('Building input type fields list from GraphQL schema')
const typeFields = graphqlSync({
  schema,
  source: print(
    gql`
      query {
        p: __type(name: "ProjectInput") {
          inputFields {
            name
            description
            type {
              kind
              ofType {
                kind
              }
            }
          }
        }
        m: __type(name: "MitigationInput") {
          inputFields {
            name
            description
            type {
              kind
              ofType {
                kind
              }
            }
          }
        }
        a: __type(name: "AdaptationInput") {
          inputFields {
            name
            description
            type {
              kind
              ofType {
                kind
              }
            }
          }
        }
      }
    `
  ),
}).data

export const projectVocabularyFields = _projectVocabularyFields
export const mitigationVocabularyFields = _mitigationVocabularyFields
export const adaptationVocabularyFields = _adaptationVocabularyFields
export const projectInputFields = Object.fromEntries(
  typeFields.p.inputFields.map(({ name, type: { kind, ofType }, description }) => [
    name,
    { kind: ofType?.kind || kind, description },
  ])
)
export const mitigationInputFields = Object.fromEntries(
  typeFields.m.inputFields.map(({ name, type: { kind, ofType }, description }) => [
    name,
    { kind: ofType?.kind || kind, description },
  ])
)
export const adaptationInputFields = Object.fromEntries(
  typeFields.a.inputFields.map(({ name, type: { kind, ofType }, description }) => [
    name,
    { kind: ofType?.kind || kind, description },
  ])
)

export default schema
