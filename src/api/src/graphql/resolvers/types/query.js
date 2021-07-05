import users from '../queries/users.js'
import roles from '../queries/roles.js'
import permissions from '../queries/permissions.js'
import projects from '../queries/projects/index.js'
import submissions from '../queries/submissions/index.js'
import controlledVocabulary from '../queries/controlled-vocabulary.js'
import PERMISSIONS from '../../../user-model/permissions.js'
import authorize from '../../../user-model/authorize.js'
import user from '../queries/user.js'
import submissionTemplates from '../queries/submission-templates.js'
import submission from '../queries/submission/index.js'

export default {
  users: authorize(PERMISSIONS.viewUsers)(users),
  roles: authorize(PERMISSIONS.viewRoles)(roles),
  submission: authorize(PERMISSIONS.createProject)(submission),
  permissions: authorize(PERMISSIONS.viewPermissions)(permissions),
  submissionTemplates: authorize(PERMISSIONS.viewSubmissionTemplates)(submissionTemplates),
  projects,
  submissions,
  user,
  controlledVocabulary,
}
