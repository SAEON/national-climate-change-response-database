import { authorizeHttp as a } from '../user-model/authorize.js'
import P from '../user-model/permissions.js'
import { pool } from '../mssql/pool.js'

// Non-authenticated routes
export { default as loginRoute } from './login/index.js'
export { default as authenticateRoute } from './authenticate/index.js'
export { default as downloadPublicFileRoute } from './download-public-file/index.js'
export { default as loginSuccessRoute } from './login-success/index.js'
export { default as logoutRoute } from './logout/index.js'
export { default as publicImageRoute } from './public-image/index.js'
export { default as oauthAuthenticationCallbackRoute } from './oauth-authentication-callback/index.js'

// Authenticated routes (see below for authentication/authorization checks on these routes)
import attachFileToSubmission from './attach-file-to-submission/index.js'
import createTenant from './create-tenant/index.js'
import template from './download-excel-submission-template/index.js'
import submissions from './download-submissions/index.js'
import flaggedVocabs from './download-flagged-vocabularies/index.js'

export const createTenantRoute = a({ permission: P['create-tenant'] })(createTenant)
export const downloadFlaggedVocabulariesRoute = a({ permission: P.DBA })(flaggedVocabs)

export const downloadExcelSubmissionTemplateRoute = a({
  permission: P['create-submission'],
})(template)

export const downloadSubmissionsRoute = a({
  permission: P['download-submission'],
})(submissions)

export const attachFileToSubmissionRoute = async ctx =>
  a({
    permission: P['update-submission'],
    resourceOwner: (
      await (await pool.connect())
        .request()
        .input('id', ctx.query?.submissionId)
        .query(`select * from Submissions where id = @id;`)
    ).recordset?.[0].createdBy,
    validTenants: (
      await (await pool.connect()).request().input('submissionId', ctx.query?.submissionId || -1)
        .query(`
          select
            tenantId
          from TenantXrefSubmission
          where
            submissionId = @submissionId;`)
    ).recordset.map(({ tenantId }) => tenantId),
  })(attachFileToSubmission)(ctx)
