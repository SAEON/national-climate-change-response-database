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

export default schema

const getFields = inputFields =>
  Object.fromEntries(
    inputFields.map(({ name, type: { kind, ofType }, description }) => {
      return [name, { kind: kind === 'NON_NULL' ? ofType.kind : kind, description }]
    })
  )

const getTreeName = ({ field, inputType }) => {
  const tree = inputType[field].description.split('::')[2].trim()

  if (!tree) {
    throw new Error(
      `Unable to get vocabulary tree from GraphQL input type. Are you sure the description is in the correct format? ("Display name :: Description :: Tree name"). Field: ${field}. Input type: ${JSON.stringify(
        inputType,
        null,
        2
      )}`
    )
  }

  return tree
}

export const projectVocabularyFields = _projectVocabularyFields
export const mitigationVocabularyFields = _mitigationVocabularyFields
export const adaptationVocabularyFields = _adaptationVocabularyFields
export const projectInputFields = getFields(typeFields.p.inputFields)
export const mitigationInputFields = getFields(typeFields.m.inputFields)
export const adaptationInputFields = getFields(typeFields.a.inputFields)

export const projectVocabularyFieldsTreeMap = Object.fromEntries(
  _projectVocabularyFields.map(field => [
    field,
    getTreeName({ field, inputType: projectInputFields }),
  ])
)

export const mitigationVocabularyFieldsTreeMap = Object.fromEntries(
  _mitigationVocabularyFields.map(field => [
    field,
    getTreeName({ field, inputType: mitigationInputFields }),
  ])
)

export const adaptationVocabularyFieldsTreeMap = Object.fromEntries(
  _adaptationVocabularyFields.map(field => [
    field,
    getTreeName({ field, inputType: adaptationInputFields }),
  ])
)
