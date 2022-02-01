import { pool } from '../../../../../../mssql/pool.js'

const sql = `
;with T1 as (
  select
      JSON_VALUE(s.submissionStatus, '$.term') submissionStatus,
      JSON_VALUE(s.project, '$.interventionType.term') intervention,
      case JSON_VALUE(s.project, '$.actualBudget')
      when '' then null
      else round(JSON_VALUE(s.project, '$.actualBudget'), 0)
      end actualBudget,
      JSON_VALUE(s.project, '$.estimatedBudget.term') estimatedBudget,
      JSON_VALUE(s.project, '$.fundingType.term') fundingSource,
    JSON_VALUE(s.mitigation, '$.hostSector.term') mitigationSector,
    JSON_VALUE(s.adaptation, '$.adaptationSector.term') adaptationSector,
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
  
  ,T2 as (
    select
        intervention,
      coalesce(
        case intervention
          when 'Mitigation' then mitigationSector
          when 'Adaptation' then adaptationSector
          else null
        end, 'Not reported'
      ) hostSector,
        coalesce(actualBudget, case estimatedBudget when '' then null else dbo.ESTIMATE_SPEND(estimatedBudget) end) coalescedBudget,
        fundingSource
    from T1
    where
        currentYear > startYear
  )
  
  select
   intervention,
   hostSector,
   sum(coalescedBudget) budget
    
  from T2
  
  group by
   intervention,
   hostSector;`

export default async ctx =>
  (
    await (
      await pool.connect()
    )
      .request()
      .input('tenantId', ctx.tenant?.id || 1)
      .query(sql)
  ).recordset
