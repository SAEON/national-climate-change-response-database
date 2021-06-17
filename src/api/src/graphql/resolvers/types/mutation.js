import createProject from '../mutations/create-project/index.js'
import updateProject from '../mutations/update-project/index.js'
import deleteProject from '../mutations/delete-project/index.js'
import assignUserRoles from '../mutations/assign-user-roles/index.js'
import migrateDatabase from '../mutations/migrate-database/index.js'
import seedDatabase from '../mutations/seed-database/index.js'
import PERMISSIONS from '../../../user-model/permissions.js'
import authorize from '../../../user-model/authorize.js'

export default {
  createProject: authorize(PERMISSIONS.updateProject)(createProject),
  updateProject: authorize(PERMISSIONS.updateProject)(updateProject),
  deleteProject: authorize(PERMISSIONS.deleteProject)(deleteProject),
  assignUserRoles: authorize(PERMISSIONS.assignRole)(assignUserRoles),

  // sysadmin
  seedDatabase: authorize(PERMISSIONS.seedDatabase)(seedDatabase),
  migrateDatabase: authorize(PERMISSIONS.migrateDatabase)(migrateDatabase),
}
