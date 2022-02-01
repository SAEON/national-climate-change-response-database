import { pool } from '../../../../../../mssql/pool.js'

const sql = `
;with T1 as (
  select
      JSON_VALUE(s.project, '$.implementationStatus.term') implementationStatus,
      JSON_VALUE(s.project, '$.interventionType.term') intervention,
      YEAR(GETDATE()) currentYear,
      year(convert(datetimeoffset, JSON_VALUE(s.project, '$.startYear')) at time zone 'South Africa Standard Time') startYear,
      year(convert(datetimeoffset, JSON_VALUE(s.project, '$.endYear')) at time zone 'South Africa Standard Time') endYear
  from Submissions s
  join TenantXrefSubmission x on x.submissionId = s.id
  where
    x.tenantId = @tenantId
    and deletedAt is null
    and isSubmitted = 1
    and JSON_VALUE(s.submissionStatus, '$.term') = 'Accepted'
  )
  
  ,T2 as (
  select
    implementationStatus,
    intervention,
    startYear,
    case
      when endYear >= currentYear then currentYear - 1
    else endYear
    end endYear,
    (case
      when endYear >= currentYear then currentYear - 1
    else endYear
    end - startYear + 1) activeYears
  from T1
  where
    startYear < currentYear
  )
  
  ,rws as (
  select
    intervention,
    implementationStatus,
    startYear [year],
    endYear
    from T2
  
  union all
  
  select
    intervention,
    implementationStatus,
    [year] + 1 [year],
    endYear
    from rws
  where
    rws.[year] < rws.endYear
  )
  
  select
  [year],
  intervention,
  count(implementationStatus) operationalProjects
  
  from rws
  
  where
    implementationStatus = 'Operational'
  
  group by
    [year],
    intervention
  
  order by [year];`

export default async ctx =>
  (
    await (
      await pool.connect()
    )
      .request()
      .input('tenantId', ctx.tenant?.id || 1)
      .query(sql)
  ).recordset
