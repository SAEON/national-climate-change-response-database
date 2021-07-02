import createProject from '../mutations/create-project/index.js'
import updateProject from '../mutations/update-project/index.js'
import deleteProject from '../mutations/delete-project/index.js'
import assignUserRoles from '../mutations/assign-user-roles/index.js'
import migrateDatabase from '../mutations/migrate-database/index.js'
import seedDatabase from '../mutations/seed-database/index.js'
import PERMISSIONS from '../../../user-model/permissions.js'
import authorize from '../../../user-model/authorize.js'
import createSubmission from '../mutations/create-submission/index.js'
import deleteSubmission from '../mutations/delete-submission/index.js'
import removeProjectFiles from '../mutations/remove-project-files/index.js'
import saveSubmission from '../mutations/save-active-submission/index.js'

export default {
  createSubmission: authorize(PERMISSIONS.createProject)(createSubmission),
  deleteSubmission: authorize(PERMISSIONS.deleteProject)(deleteSubmission), // TODO - new permission?
  createProject: authorize(PERMISSIONS.createProject)(createProject),
  updateProject: authorize(PERMISSIONS.updateProject)(updateProject),
  deleteProject: authorize(PERMISSIONS.deleteProject)(deleteProject),
  assignUserRoles: authorize(PERMISSIONS.assignRole)(assignUserRoles),
  seedDatabase: authorize(PERMISSIONS.seedDatabase)(seedDatabase),
  migrateDatabase: authorize(PERMISSIONS.migrateDatabase)(migrateDatabase),
  killServer: authorize(PERMISSIONS.killServer)(() => process.exit(1)),
  removeProjectFiles: authorize(PERMISSIONS.uploadProjectFile)(removeProjectFiles), // TODO - new permission?
  saveSubmission: authorize(PERMISSIONS.createProject)(saveSubmission), // TODO - new permission?
}
