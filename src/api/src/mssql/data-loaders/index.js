import _searchVocabularyTree from './_search-vocabulary-tree.js'
import _findVocabulary from './_find-vocabulary.js'
import _findRegionGeometry from './_find-region-geometry.js'
import _findUserTenantRoles from './_find-user-tenant-roles.js'
import _findRolePermissions from './_find-role-permissions.js'
import _findUserPermissions from './_find-user-permissions.js'
import _findSubmissionTemplateUsers from './_find-submission-template-users.js'
import _findUserSubmissions from './_find-user-submissions.js'
import _findRegions from './_find-regions.js'
import _findUserTenants from './_find-user-tenants.js'
import _findRoles from './_find-roles.js'

export const makeDataFinders = () => {
  const searchVocabularyTree = _searchVocabularyTree()
  const findVocabulary = _findVocabulary()
  const findRegionGeometry = _findRegionGeometry()
  const findUserTenantRoles = _findUserTenantRoles()
  const findRolePermissions = _findRolePermissions()
  const findUserPermissions = _findUserPermissions()
  const findSubmissionTemplateUsers = _findSubmissionTemplateUsers()
  const findUserSubmissions = _findUserSubmissions()
  const findRegions = _findRegions()
  const findUserTenants = _findUserTenants()
  const findRoles = _findRoles()

  return {
    searchVocabularyTree: ({ ids, tree }) => searchVocabularyTree.load({ ids, tree }),
    findVocabulary: id => findVocabulary.load(id),
    findUserTenantRoles: userId => findUserTenantRoles.load(userId),
    findUserSubmissions: userId => findUserSubmissions.load(userId),
    findUserPermissions: userId => findUserPermissions.load(userId),
    findRolePermissions: roleId => findRolePermissions.load(roleId),
    findRegionGeometry: vocabularyId => findRegionGeometry.load(vocabularyId),
    findSubmissionTemplateUsers: userId => findSubmissionTemplateUsers.load(userId),
    findRegions: regionId => findRegions.load(regionId),
    findUserTenants: userId => findUserTenants.load(userId),
    findRoles: id => findRoles.load(id),
  }
}
