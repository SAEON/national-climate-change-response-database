import users from '../../queries/users/index.js'
import user from '../../queries/user/index.js'
import roles from '../../queries/roles.js'
import permissions from '../../queries/permissions.js'
import submissions from '../../queries/submissions/index.js'
import controlledVocabulary from '../../queries/controlled-vocabulary.js'
import PERMISSIONS from '../../../../user-model/permissions.js'
import authorize from '../../../../user-model/authorize.js'
import submissionTemplates from '../../queries/submission-templates.js'
import submission from '../../queries/submission/index.js'
import pageInfo from '../../queries/page-info/index.js'
import tenants from '../../queries/tenants/index.js'
import regions from '../../queries/regions/index.js'
import clientContext from '../../queries/client-context/index.js'

export default {
  users: authorize({ permission: PERMISSIONS['view-users'] })(users),
  roles: authorize({ permission: PERMISSIONS['view-roles'] })(roles),
  permissions: authorize({ permission: PERMISSIONS['view-permissions'] })(permissions),
  submissionTemplates: authorize({ permission: PERMISSIONS['view-submission-templates'] })(
    submissionTemplates
  ),
  tenants: authorize({ permission: PERMISSIONS['view-tenants'] })(tenants),
  clientContext,
  submission,
  submissions,
  pageInfo,
  regions,
  user,
  controlledVocabulary,
}