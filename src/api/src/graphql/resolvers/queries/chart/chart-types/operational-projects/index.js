import { pool } from '../../../../../../mssql/pool.js'

const sql = `
;with T1 as (
  select
    coalesce(JSON_VALUE(s.project, '$.implementationStatus.term'), 'Unknown') implementationStatus,
    JSON_VALUE(s.project, '$.interventionType.term') intervention
  from Submissions s
  join TenantXrefSubmission x on x.submissionId = s.id
  where
    x.tenantId = @tenantId
    and deletedAt is null
    and isSubmitted = 1
    and JSON_VALUE(s.submissionStatus, '$.term') = 'Accepted'
)

select
  implementationStatus,
  intervention,
  count(*) [total]
from T1
group by
  implementationStatus,
  intervention;`

export default async ctx =>
  (
    await (
      await pool.connect()
    )
      .request()
      .input('tenantId', ctx.tenant?.id || 1)
      .query(sql)
  ).recordset
