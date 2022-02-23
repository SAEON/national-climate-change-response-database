import users from '../../queries/users/index.js'
import user from '../../queries/user/index.js'
import roles from '../../queries/roles.js'
import permissions from '../../queries/permissions.js'
import submissions from '../../queries/submissions/index.js'
import controlledVocabulary from '../../queries/controlled-vocabulary.js'
import PERMISSIONS from '../../../../user-model/permissions.js'
import { authorizeGql as a } from '../../../../user-model/authorize.js'
import submission from '../../queries/submission/index.js'
import pageInfo from '../../queries/page-info/index.js'
import tenants from '../../queries/tenants/index.js'
import regions from '../../queries/regions/index.js'
import clientContext from '../../queries/client-context/index.js'
import chart from '../../queries/chart/index.js'
import formLayout from '../../queries/form-layout.js'
import incorrectSubmissionVocabularies from '../../queries/incorrect-submission-vocabularies/index.js'
import flattenedTree from '../../queries/flattened-tree/index.js'
import fixVocabularySql from '../../queries/fix-vocabulary-sql/index.js'

export default {
  flattenedTree: a({ permission: PERMISSIONS.DBA })(flattenedTree),
  fixVocabularySql: a({ permission: PERMISSIONS.DBA })(fixVocabularySql),
  users: a({ permission: PERMISSIONS['view-users'] })(users),
  roles: a({ permission: PERMISSIONS['view-roles'] })(roles),
  permissions: a({ permission: PERMISSIONS['view-permissions'] })(permissions),
  incorrectSubmissionVocabularies: a({ permission: PERMISSIONS.DBA })(
    incorrectSubmissionVocabularies
  ),
  formLayout: a({ permission: PERMISSIONS['create-submission'] })(formLayout),
  tenants,
  chart,
  clientContext,
  submission,
  submissions,
  pageInfo,
  regions,
  user,
  controlledVocabulary,
}
