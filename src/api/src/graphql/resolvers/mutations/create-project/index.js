import logSql from '../../../../lib/log-sql.js'
import normalizeFormInput from './_normalize-form-input.js'
import {
  makeAdaptationsInsertStmt,
  makeProjectInsertStmt,
  makeMitigationsInsertStmt,
} from './_make-insert-statements.js'
import makeEnergyInsertStmt from './_make-energy-insert-statement.js'
import makeEmissionsInsertStmts from './_make-emissions-insert-statements.js'
import makeProgressInsertStmt from './_make-progress-insert-statement.js'
import makeExpenditureInsertStmt from './_make-expenditure-insert-statement.js'

const limitedPermissionFields = {
  project: [
    { fieldName: 'validationStatus', requiredPermission: 'validate-submission' },
    { fieldName: 'validationComments', requiredPermission: 'validate-submission' },
  ],
}

export default async (
  _,
  { generalDetailsForm, mitigationDetailsForm = {}, adaptationDetailsForm = {} },
  ctx
) => {
  const { user, mssql } = ctx
  const { query } = mssql

  const userId = user.info(ctx).id
  const now = new Date().toISOString()

  /**
   * Get the form values in a useful way
   * to turn them into an insertion query
   */

  generalDetailsForm = normalizeFormInput(generalDetailsForm)
  mitigationDetailsForm = normalizeFormInput(mitigationDetailsForm)
  adaptationDetailsForm = normalizeFormInput(adaptationDetailsForm)

  /**
   * Some fields can only be filled in by admin users
   * Make sure that if these fields are filled in, that
   * the user has the correct permissions to do so
   */
  const requiredPermissions = Object.entries(limitedPermissionFields).reduce((acc, [, fields]) => {
    const permissions = []
    fields.forEach(({ requiredPermission }) => {
      permissions.push(requiredPermission)
    })
    return [...new Set([...acc, ...permissions])]
  }, [])

  if (requiredPermissions.length) {
    user.ensurePermissions({ ctx, permissions: requiredPermissions })
  }

  /**
   * Create the insertion query
   */

  const sql = `
    begin transaction T
    begin try

      -- temp tables
      drop table if exists #newProject;
      create table #newProject(id int);
      drop table if exists #newMitigation;
      create table #newMitigation(id int);

      -- project
      ${makeProjectInsertStmt({
        simpleInput: generalDetailsForm.simpleInput,
        vocabInput: generalDetailsForm.vocabInput,
        userId,
        now,
      })}

      insert into #newProject (id)
      select scope_identity() id;

      -- mitigations
      ${makeMitigationsInsertStmt({
        simpleInput: mitigationDetailsForm.simpleInput,
        vocabInput: mitigationDetailsForm.vocabInput,
        projectId: true,
      })}

      insert into #newMitigation (id)
      select scope_identity() id;
        
      ${makeEnergyInsertStmt(mitigationDetailsForm.energyData)}
      ${makeEmissionsInsertStmts(mitigationDetailsForm.emissionsData)}
      ${makeProgressInsertStmt(mitigationDetailsForm.progressData?.grid1)}
      ${makeExpenditureInsertStmt(mitigationDetailsForm.progressData?.grid2)}

      -- adaptations
      ${makeAdaptationsInsertStmt({
        simpleInput: adaptationDetailsForm.simpleInput,
        vocabInput: adaptationDetailsForm.vocabInput,
        projectId: true,
      })}

      select id from #newProject;
      commit transaction T
    end try
    begin catch
      rollback transaction T
    end catch`

  logSql(sql, 'Create project')

  const result = await query(sql)
  return { id: result.recordset[0].id }
}
