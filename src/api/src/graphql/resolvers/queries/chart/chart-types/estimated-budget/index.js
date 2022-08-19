import { pool } from '../../../../../../mssql/pool.js'

const sql = `
;with T1 as (
  select
      s._id id,
      JSON_VALUE(s.submissionStatus, '$.term') submissionStatus,
      JSON_VALUE(s.project, '$.implementationStatus.term') implementationStatus,
      JSON_VALUE(s.project, '$.interventionType.term') intervention,
      case JSON_VALUE(s.project, '$.actualBudget')
        when '' then null
        else round(JSON_VALUE(s.project, '$.actualBudget'), 0)
      end actualBudget,
      JSON_VALUE(s.project, '$.estimatedBudget.term') estimatedBudget,
      JSON_VALUE(s.project, '$.fundingType.term') fundingSource,
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
    id,
    implementationStatus,
    intervention,
    actualBudget,
    estimatedBudget,
    fundingSource,
    startYear,
    case
      when endYear >= currentYear then currentYear - 1
      else endYear
    end endYear,
    (case
      when endYear >= currentYear then currentYear - 1
      else endYear
    end - startYear + 1) activeYears,
    coalesce(actualBudget, case estimatedBudget when '' then null else dbo.ESTIMATE_SPEND(estimatedBudget) end) coalescedBudget,
    round(coalesce(actualBudget, case estimatedBudget when '' then null else dbo.ESTIMATE_SPEND(estimatedBudget) end) / (endYear - startYear + 1), 0) annualBudget
  from T1
  where
  startYear < currentYear
)
  
,rws as (
  select
    id,
    intervention,
    startYear [year],
    endYear,
    annualBudget
  from T2
  where
    annualBudget is not null
  
  union all
  
  select
    id,
    intervention,
    [year] + 1 [year],
    endYear,
    annualBudget
  from rws
  where
    rws.[year] < rws.endYear
)
  
select
  [year],
  intervention,
  sum(annualBudget) spend
from rws
group by
  [year],
  intervention
order by
  [year] asc;`

export default async ctx =>
  (
    await (
      await pool.connect()
    )
      .request()
      .input('tenantId', ctx.tenant?.id || 1)
      .query(sql)
  ).recordset
