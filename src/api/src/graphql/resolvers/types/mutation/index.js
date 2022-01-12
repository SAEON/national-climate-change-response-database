import assignRolesToUser from '../../mutations/assign-roles-to-user/index.js'
import seedDatabase from '../../mutations/seed-database/index.js'
import PERMISSIONS from '../../../../user-model/permissions.js'
import authorize from '../../../../user-model/authorize.js'
import createSubmission from '../../mutations/create-submission/index.js'
import deleteSubmission from '../../mutations/delete-submission/index.js'
import removeSubmissionAttachments from '../../mutations/remove-submission-attachments/index.js'
import saveSubmission from '../../mutations/save-submission/index.js'
import updateTenant from '../../mutations/update-tenant/index.js'
import deleteTenants from '../../mutations/delete-tenants/index.js'
import { pool } from '../../../../mssql/pool.js'

const getSubmissionOwner = id =>
  pool
    .connect()
    .then(pool => pool.request().input('id', id).query(`select * from Submissions where id = @id;`))
    .then(({ recordset }) => recordset[0].userId)

export default {
  // Submission
  createSubmission: authorize(PERMISSIONS['create-submission'])(createSubmission),
  saveSubmission: async (...args) =>
    authorize(
      PERMISSIONS['update-submission'],
      await getSubmissionOwner(args[1].submissionId)
    )(saveSubmission)(...args),
  deleteSubmission: async (...args) =>
    authorize(
      PERMISSIONS['delete-submission'],
      await getSubmissionOwner(args[1].id)
    )(deleteSubmission)(...args),
  removeSubmissionAttachments: authorize(PERMISSIONS['attach-file-to-submission'])(
    removeSubmissionAttachments
  ),

  // Access
  assignRolesToUser: authorize(PERMISSIONS['assign-role'])(assignRolesToUser),

  // DB
  seedDatabase: authorize(PERMISSIONS['seed-database'])(seedDatabase),

  // Tenants
  updateTenant: authorize(PERMISSIONS['update-tenant'])(updateTenant),
  deleteTenants: authorize(PERMISSIONS['delete-tenant'])(deleteTenants),
}
