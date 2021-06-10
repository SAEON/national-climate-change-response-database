import _searchVocabularyTree from './_search-vocabulary-tree.js'
import _findVocabulary from './_find-vocabulary.js'
import _findGeometry from './_find-geometry.js'
import _findUserRoles from './_find-user-roles.js'

export const makeDataFinders = () => {
  const searchVocabularyTree = _searchVocabularyTree()
  const findVocabulary = _findVocabulary()
  const findGeometry = _findGeometry()
  const findUserRoles = _findUserRoles()

  return {
    searchVocabularyTree: ({ ids, tree }) => searchVocabularyTree.load({ ids, tree }),
    findVocabulary: id => findVocabulary.load(id),
    findUserRoles: userId => findUserRoles.load(userId),
    findGeometry: ({ vocabularyId, tree, simplified = true }) =>
      findGeometry.load({ vocabularyId, tree, simplified }),
  }
}
