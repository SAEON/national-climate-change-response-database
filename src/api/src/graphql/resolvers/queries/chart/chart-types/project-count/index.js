import { pool } from '../../../../../../mssql/pool.js'

const sql = `
;with T1 as (
  select JSON_VALUE(s.project, '$.interventionType.term') intervention,
  coalesce(JSON_VALUE(s.project, '$.implementationStatus.term'), 'Not reported') implementationStatus,
  YEAR(GETDATE()) currentYear,
  year(convert(datetimeoffset, JSON_VALUE(s.project, '$.startYear')) at time zone 'South Africa Standard Time') startYear
  from Submissions s
  join TenantXrefSubmission x on x.submissionId = s.id
  where
    x.tenantId = @tenantId
    and deletedAt is null
    and isSubmitted = 1
    and JSON_VALUE(s.submissionStatus, '$.term') = 'Accepted'
  )
  
select
  intervention,
  implementationStatus,
  count(intervention) [total]
from T1
where
  currentYear > startYear
group by
  intervention,
  implementationStatus
order by
  total desc;`

export default async ctx =>
  (
    await (
      await pool.connect()
    )
      .request()
      .input('tenantId', ctx.tenant?.id || 1)
      .query(sql)
  ).recordset
