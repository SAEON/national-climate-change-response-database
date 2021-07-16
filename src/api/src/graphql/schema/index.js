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

export const projectVocabularyFields = _projectVocabularyFields
export const mitigationVocabularyFields = _mitigationVocabularyFields
export const adaptationVocabularyFields = _adaptationVocabularyFields

export default schema
