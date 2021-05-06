import _findVocabulary from './_find-vocabulary.js'

export const makeDataFinders = () => {
  const findVocabulary = _findVocabulary()

  return {
    findVocabulary: ({ ids, tree }) => {
      return findVocabulary.load({ ids, tree })
    },
  }
}
