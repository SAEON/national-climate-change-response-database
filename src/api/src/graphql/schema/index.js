import { graphqlSync } from 'graphql'
import { print } from 'graphql/language/printer.js'
import { gql } from 'apollo-server-koa'
import { makeExecutableSchema } from 'graphql-tools'
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

console.info('Building type fields list from GraphQL schema')
const typeFields = graphqlSync(
  schema,
  print(
    gql`
      query {
        projectFields: __type(name: "Project") {
          fields {
            name
            type {
              name
              ofType {
                name
              }
            }
          }
        }
        mitigationFields: __type(name: "Mitigation") {
          fields {
            name
            type {
              name
              ofType {
                name
              }
            }
          }
        }
        adaptationFields: __type(name: "Adaptation") {
          fields {
            name
            type {
              name
              ofType {
                name
              }
            }
          }
        }
      }
    `
  )
).data

export const projectFields = typeFields.projectFields.fields
export const mitigationFields = typeFields.mitigationFields.fields
export const adaptationFields = typeFields.adaptationFields.fields
export const projectVocabularyFields = _projectVocabularyFields
export const mitigationVocabularyFields = _mitigationVocabularyFields
export const adaptationVocabularyFields = _adaptationVocabularyFields

export default schema
