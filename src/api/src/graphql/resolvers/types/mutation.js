import assignUserRoles from '../mutations/assign-user-roles/index.js'
import migrateDatabase from '../mutations/migrate-database/index.js'
import seedDatabase from '../mutations/seed-database/index.js'
import PERMISSIONS from '../../../user-model/permissions.js'
import authorize from '../../../user-model/authorize.js'
import createSubmission from '../mutations/create-submission/index.js'
import deleteSubmission from '../mutations/delete-submission/index.js'
import removeProjectFiles from '../mutations/remove-project-files/index.js'
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
  createSubmission: authorize(PERMISSIONS.createProject)(createSubmission),
  deleteSubmission: async (...args) =>
    authorize(PERMISSIONS.deleteProject, await getSubmissionOwner(args[1].id))(deleteSubmission)(
      ...args
    ),
  assignUserRoles: authorize(PERMISSIONS.assignRole)(assignUserRoles),
  seedDatabase: authorize(PERMISSIONS.seedDatabase)(seedDatabase),
  migrateDatabase: authorize(PERMISSIONS.migrateDatabase)(migrateDatabase),
  killServer: authorize(PERMISSIONS.killServer)(() => process.exit(1)),
  removeProjectFiles: authorize(PERMISSIONS.uploadProjectFile)(removeProjectFiles),
  saveSubmission: async (...args) =>
    authorize(
      PERMISSIONS.updateProject,
      await getSubmissionOwner(args[1].submissionId)
    )(saveSubmission)(...args),
}
