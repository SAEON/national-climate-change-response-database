import assignRolesToUser from '../mutations/assign-roles-to-user/index.js'
import seedDatabase from '../mutations/seed-database/index.js'
import PERMISSIONS from '../../../user-model/permissions.js'
import authorize from '../../../user-model/authorize.js'
import createSubmission from '../mutations/create-submission/index.js'
import deleteSubmission from '../mutations/delete-submission/index.js'
import removeSubmissionAttachments from '../mutations/remove-submission-attachments/index.js'
import saveSubmission from '../mutations/save-submission/index.js'
import { pool } from '../../../mssql/pool.js'

const getSubmissionOwner = id =>
  pool
    .connect()
    .then(pool => pool.request().input('id', id).query(`select * from Submissions where id = @id;`))
    .then(({ recordset }) => recordset[0].userId)

export default {
  createSubmission: authorize(PERMISSIONS['create-submission'])(createSubmission),
  deleteSubmission: async (...args) =>
    authorize(
      PERMISSIONS['delete-submission'],
      await getSubmissionOwner(args[1].id)
    )(deleteSubmission)(...args),
  assignRolesToUser: authorize(PERMISSIONS['assign-role'])(assignRolesToUser),
  seedDatabase: authorize(PERMISSIONS['seed-database'])(seedDatabase),
  removeSubmissionAttachments: authorize(PERMISSIONS['attach-file-to-submission'])(
    removeSubmissionAttachments
  ),
  saveSubmission: async (...args) =>
    authorize(
      PERMISSIONS['update-submission'],
      await getSubmissionOwner(args[1].submissionId)
    )(saveSubmission)(...args),
}
