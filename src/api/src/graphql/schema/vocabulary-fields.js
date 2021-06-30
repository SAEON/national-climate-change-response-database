/**
 * Resolvers for the vocabulary fields are built dynamically,
 * so the list of vocabulary fields has to be determined from
 * the .graphql type definition files and NOT from the built
 * schema
 */

import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import getCurrentDirectory from '../../lib/get-current-directory.js'
import getVocabularyFields from './_get-vocabulary-fields-from-type.js'

const __dirname = getCurrentDirectory(import.meta)

const SCHEMA_PARTS = readdirSync(join(__dirname, './type-defs'))

const _import = p =>
  readFileSync(join(getCurrentDirectory(import.meta), p), {
    encoding: 'utf-8',
  })

const typeDefs = SCHEMA_PARTS.map(name => `${_import(`./type-defs/${name}`)}`).join('\n')

console.info('Building vocabularies field list from Graphql schema definitions')
export const projectVocabularyFields = getVocabularyFields(typeDefs, 'Project')
export const mitigationVocabularyFields = getVocabularyFields(typeDefs, 'Mitigation')
export const adaptationVocabularyFields = getVocabularyFields(typeDefs, 'Adaptation')
