import { pool } from '../../../../../../mssql/pool.js'

const sql = `
;with T1 as (
  select
    s.id,
    JSON_VALUE(s.submissionStatus, '$.term') submissionStatus,
    JSON_VALUE(s.project, '$.implementationStatus.term') implementationStatus,
    JSON_VALUE(s.project, '$.interventionType.term') intervention,
    case JSON_VALUE(s.project, '$.actualBudget')
      when '' then null
      else round(JSON_VALUE(s.project, '$.actualBudget'), 0)
    end actualBudget,
    JSON_VALUE(s.project, '$.estimatedBudget.term') estimatedBudget,
    JSON_VALUE(s.project, '$.fundingType.term') fundingSource,
    JSON_VALUE(s.mitigation, '$.hostSector.term') mitigationSector,
    JSON_VALUE(s.adaptation, '$.adaptationSector.term') adaptationSector,      
    year(convert(datetimeoffset, JSON_VALUE(s.project, '$.startYear')) at time zone 'South Africa Standard Time') startYear,
    year(convert(datetimeoffset, JSON_VALUE(s.project, '$.endYear')) at time zone 'South Africa Standard Time') endYear,
    case JSON_VALUE(_province.[value], '$.term')
      when 'National' then 'South Africa'
      else JSON_VALUE(_province.[value], '$.term')
    end province,
    JSON_VALUE(_districtMunicipality.[value], '$.term') districtMunicipality,
    JSON_VALUE(_localMunicipality.[value], '$.term') localMunicipality,
    coalesce(
      JSON_VALUE(_localMunicipality.[value], '$.term'),
      JSON_VALUE(_districtMunicipality.[value], '$.term'),
      case JSON_VALUE(_province.[value], '$.term')
        when 'National' then 'South Africa'
        else JSON_VALUE(_province.[value], '$.term')
      end,
      'South Africa'
    ) coalescedRegion,
    case JSON_VALUE(s.project, '$.xy')
      when 'GEOMETRYCOLLECTION ()' then null
      else JSON_VALUE(s.project, '$.xy')
    end xy
  from Submissions s
  outer apply openjson(s.project, '$.province') _province
  outer apply openjson(s.project, '$.districtMunicipality') _districtMunicipality
  outer apply openjson(s.project, '$.localMunicipality') _localMunicipality
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
    coalesce(
    case intervention
      when 'Mitigation' then mitigationSector
      when 'Adaptation' then adaptationSector
      else null
    end, 'Not reported'
    ) hostSector,
    coalesce(actualBudget, case estimatedBudget when '' then null else dbo.ESTIMATE_SPEND(estimatedBudget) end) budget,
    fundingSource,
    startYear,
    endYear,
    (endYear - startYear + 1) activeYears,
    round(coalesce(actualBudget, case estimatedBudget when '' then null else dbo.ESTIMATE_SPEND(estimatedBudget) end) / (endYear - startYear + 1), 0) annualBudget,
    province,
    districtMunicipality,
    localMunicipality,
    coalescedRegion,
    coalesce(geometry::STGeomFromText(xy, 4326), (select centroid from Regions where [name] = T1.coalescedRegion)) xy
  from T1
)
  
,T3 as (
	select distinct
		id,
		coalescedRegion,
		coalesce(budget, PERCENTILE_CONT(0.5) within group (order by budget) over()) budget,
		PERCENTILE_CONT(0.3) within group (order by budget) over() usefulMinBudget,
		PERCENTILE_CONT(0.7) within group (order by budget) over() usefulMaxBudget,
		xy.STAsText() xy
	from T2
	where
	  xy is not null
	  and coalescedRegion != 'South Africa'
)

select
xy,
( budget - usefulMinBudget ) / ( usefulMaxBudget  - usefulMinBudget ) normalizedBudget
from T3;`

export default async ctx =>
  (
    await (
      await pool.connect()
    )
      .request()
      .input('tenantId', ctx.tenant?.id || 1)
      .query(sql)
  ).recordset
