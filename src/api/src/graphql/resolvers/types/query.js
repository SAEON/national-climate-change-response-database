import users from '../queries/users.js'
import roles from '../queries/roles.js'
import permissions from '../queries/permissions.js'
import projects from '../queries/projects/index.js'
import controlledVocabulary from '../queries/controlled-vocabulary.js'
import PERMISSIONS from '../../../user-model/permissions.js'
import authorize from '../../../user-model/authorize.js'
import user from '../queries/user.js'

export default {
  users: authorize(PERMISSIONS.viewUsers)(users),
  roles: authorize(PERMISSIONS.viewRoles)(roles),
  permissions: authorize(PERMISSIONS.viewPermissions)(permissions),
  projects,
  user,
  controlledVocabulary,
}
