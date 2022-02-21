import assignRolesToUser from '../../mutations/assign-roles-to-user/index.js'
import PERMISSIONS from '../../../../user-model/permissions.js'
import authorize from '../../../../user-model/authorize.js'
import createSubmission from '../../mutations/create-submission/index.js'
import deleteSubmission from '../../mutations/delete-submission/index.js'
import removeSubmissionAttachments from '../../mutations/remove-submission-attachments/index.js'
import saveSubmission from '../../mutations/save-submission/index.js'
import updateTenant from '../../mutations/update-tenant/index.js'
import deleteTenants from '../../mutations/delete-tenants/index.js'
import { pool } from '../../../../mssql/pool.js'
import migrateDatabase from '../../mutations/migrate-database/index.js'
import fixVocabulary from '../../mutations/fix-vocabulary/index.js'

const getSubmissionOwner = id =>
  pool
    .connect()
    .then(pool => pool.request().input('id', id).query(`select * from Submissions where id = @id;`))
    .then(({ recordset }) => recordset[0].userId)

export default {
  // Submission
  createSubmission: authorize({ permission: PERMISSIONS['create-submission'] })(createSubmission),
  saveSubmission: async (...args) =>
    authorize({
      permission: PERMISSIONS['update-submission'],
      resourceOwner: await getSubmissionOwner(args[1].submissionId),
    })(saveSubmission)(...args),
  deleteSubmission: async (...args) =>
    authorize({
      permission: PERMISSIONS['delete-submission'],
      resourceOwner: await getSubmissionOwner(args[1].id),
    })(deleteSubmission)(...args),
  removeSubmissionAttachments: authorize({ permission: PERMISSIONS['attach-file-to-submission'] })(
    removeSubmissionAttachments
  ),

  // Submissions
  fixVocabulary: authorize({ permission: PERMISSIONS.DBA })(fixVocabulary),

  // Access
  assignRolesToUser: authorize({ permission: PERMISSIONS['assign-role'] })(assignRolesToUser),

  // DB
  migrateDatabase: authorize({ permission: PERMISSIONS['migrate-database'] })(migrateDatabase),

  // Tenants
  updateTenant: authorize({ permission: PERMISSIONS['update-tenant'] })(updateTenant),
  deleteTenants: authorize({ permission: PERMISSIONS['delete-tenant'] })(deleteTenants),
}
