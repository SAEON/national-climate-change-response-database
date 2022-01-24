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

/**
 * Load GraphQL definition strings
 */
const STATIC_SCHEMA_PARTS = readdirSync(join(__dirname, './type-defs'))

/**
 * Load GraphQL enum of database migrations
 */
const DB_MIGRATION_ENUM = `enum Migrations { ${readdirSync(
  join(__dirname, '../resolvers/mutations/migrate-database/migrations')
)
  .map(entry => entry.replaceAll('-', '_').toUpperCase())
  .join(' ')} }`

/**
 * Load GraphQL enum of chart types
 */
const CHART_TYPES_ENUM = `enum Chart { ${readdirSync(
  join(__dirname, '../resolvers/queries/chart/chart-types')
)
  .map(entry => entry.replaceAll('-', '_').toUpperCase())
  .join(' ')} }`

/**
 * Merge GraphQL definition strings
 */
const typeDefs = [
  ...STATIC_SCHEMA_PARTS.map(name => `${_import(`./type-defs/${name}`)}`),
  DB_MIGRATION_ENUM,
  CHART_TYPES_ENUM,
].join('\n')

/**
 * Create GraphQL schema from type definition string
 */
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
