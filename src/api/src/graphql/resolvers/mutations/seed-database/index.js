import loadErmData from './erm/index.js'
import loadVocabularies from './vocabularies/index.js'

export default async (_, { erm = false, vocabularies = false }, ctx) => {
  const result = {}

  result.vocabularies = vocabularies ? await loadVocabularies() : false
  result.erm = erm ? await loadErmData(ctx) : false

  return result
}
