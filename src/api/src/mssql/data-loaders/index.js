import _searchVocabularyTree from './_search-vocabulary-tree.js'
import _findVocabulary from './_find-vocabulary.js'
import _findRegionGeometry from './_find-region-geometry.js'
import _findUserRoles from './_find-user-roles.js'
import _findRolePermissions from './_find-role-permissions.js'
import _findUserPermissions from './_find-user-permissions.js'
import _findSubmissionTemplateUsers from './_find-submission-template-users.js'
import _findUserSubmissions from './_find-user-submissions.js'

export const makeDataFinders = () => {
  const searchVocabularyTree = _searchVocabularyTree()
  const findVocabulary = _findVocabulary()
  const findRegionGeometry = _findRegionGeometry()
  const findUserRoles = _findUserRoles()
  const findRolePermissions = _findRolePermissions()
  const findUserPermissions = _findUserPermissions()
  const findSubmissionTemplateUsers = _findSubmissionTemplateUsers()
  const findUserSubmissions = _findUserSubmissions()

  return {
    searchVocabularyTree: ({ ids, tree }) => searchVocabularyTree.load({ ids, tree }),
    findVocabulary: id => findVocabulary.load(id),
    findUserRoles: userId => findUserRoles.load(userId),
    findUserSubmissions: userId => findUserSubmissions.load(userId),
    findUserPermissions: userId => findUserPermissions.load(userId),
    findRolePermissions: roleId => findRolePermissions.load(roleId),
    findRegionGeometry: vocabularyId => findRegionGeometry.load(vocabularyId),
    findSubmissionTemplateUsers: userId => findSubmissionTemplateUsers.load(userId),
  }
}
