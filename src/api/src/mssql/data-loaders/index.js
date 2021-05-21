import _searchVocabularyTree from './_search-vocabulary-tree.js'
import _findVocabulary from './_find-vocabulary.js'
import _findGeometry from './_find-geometry.js'

export const makeDataFinders = () => {
  const searchVocabularyTree = _searchVocabularyTree()
  const findVocabulary = _findVocabulary()
  const findGeometry = _findGeometry()

  return {
    searchVocabularyTree: ({ ids, tree }) => searchVocabularyTree.load({ ids, tree }),
    findVocabulary: id => findVocabulary.load(id),
    findGeometry: ({ vocabularyId, tree, simplified = true }) =>
      findGeometry.load({ vocabularyId, tree, simplified }),
  }
}
