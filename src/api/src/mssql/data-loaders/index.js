import _searchVocabularyTree from './_search-vocabulary-tree.js'
import _findVocabulary from './_find-vocabulary.js'

export const makeDataFinders = () => {
  const searchVocabularyTree = _searchVocabularyTree()
  const findVocabulary = _findVocabulary()

  return {
    searchVocabularyTree: ({ ids, tree }) => searchVocabularyTree.load({ ids, tree }),
    findVocabulary: id => findVocabulary.load(id),
  }
}
