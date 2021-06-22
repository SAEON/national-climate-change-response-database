import _searchVocabularyTree from './_search-vocabulary-tree.js'
import _findVocabulary from './_find-vocabulary.js'
import _findGeometry from './_find-geometry.js'
import _findUserRoles from './_find-user-roles.js'
import _findRolePermissions from './_find-role-permissions.js'
import _findUserPermissions from './_find-user-permissions.js'
import _findSubmissionTemplateUsers from './_find-submission-template-users.js'
import _findUserProjects from './_find-user-projects.js'

export const makeDataFinders = () => {
  const searchVocabularyTree = _searchVocabularyTree()
  const findVocabulary = _findVocabulary()
  const findGeometry = _findGeometry()
  const findUserRoles = _findUserRoles()
  const findRolePermissions = _findRolePermissions()
  const findUserPermissions = _findUserPermissions()
  const findSubmissionTemplateUsers = _findSubmissionTemplateUsers()
  const findUserProjects = _findUserProjects()

  return {
    searchVocabularyTree: ({ ids, tree }) => searchVocabularyTree.load({ ids, tree }),
    findVocabulary: id => findVocabulary.load(id),
    findUserRoles: userId => findUserRoles.load(userId),
    findUserProjects: userId => findUserProjects.load(userId),
    findUserPermissions: userId => findUserPermissions.load(userId),
    findRolePermissions: roleId => findRolePermissions.load(roleId),
    findGeometry: ({ vocabularyId, tree, simplified = true }) =>
      findGeometry.load({ vocabularyId, tree, simplified }),
    findSubmissionTemplateUsers: userId => findSubmissionTemplateUsers.load(userId),
  }
}
