import createProject from '../mutations/create-project/index.js'
import updateProject from '../mutations/update-project/index.js'
import deleteProject from '../mutations/delete-project/index.js'
import updateVocabulary from '../mutations/update-vocabulary/index.js'
import integrateOldDb from '../mutations/integrate-old-db/index.js'
import assignUserRoles from '../mutations/assign-user-roles/index.js'

export default {
  createProject,
  updateProject,
  updateVocabulary,
  integrateOldDb,
  deleteProject,
  assignUserRoles,
}
