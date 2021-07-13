import assignUserRoles from '../mutations/assign-user-roles/index.js'
import migrateDatabase from '../mutations/migrate-database/index.js'
import seedDatabase from '../mutations/seed-database/index.js'
import PERMISSIONS from '../../../user-model/permissions.js'
import authorize from '../../../user-model/authorize.js'
import createSubmission from '../mutations/create-submission/index.js'
import deleteSubmission from '../mutations/delete-submission/index.js'
import removeSubmissionAttachments from '../mutations/remove-submission-attachments/index.js'
import saveSubmission from '../mutations/save-submission/index.js'
import query from '../../../mssql/query.js'

const getSubmissionOwner = async id =>
  (
    await query(
      `select *
     from Submissions
     where id = '${sanitizeSqlValue(id)}';`
    )
  ).recordset[0].createdBy

export default {
  createSubmission: authorize(PERMISSIONS.createSubmission)(createSubmission),
  deleteSubmission: async (...args) =>
    authorize(PERMISSIONS.deleteSubmission, await getSubmissionOwner(args[1].id))(deleteSubmission)(
      ...args
    ),
  assignUserRoles: authorize(PERMISSIONS.assignRole)(assignUserRoles),
  seedDatabase: authorize(PERMISSIONS.seedDatabase)(seedDatabase),
  migrateDatabase: authorize(PERMISSIONS.migrateDatabase)(migrateDatabase),
  killServer: authorize(PERMISSIONS.killServer)(() => process.exit(1)),
  removeSubmissionAttachments: authorize(PERMISSIONS.attachFileToSubmission)(
    removeSubmissionAttachments
  ),
  saveSubmission: async (...args) =>
    authorize(
      PERMISSIONS.updateSubmission,
      await getSubmissionOwner(args[1].submissionId)
    )(saveSubmission)(...args),
}
