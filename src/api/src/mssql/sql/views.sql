-- TenantXrefSubmission
create or alter view TenantXrefSubmission with schemabinding
as
  select distinct
    x.tenantId,
    x.submissionId

  from ( select
           s.id submissionId,
           t.id tenantId,
           t.regionId,
           t.includeUnboundedSubmissions,
           JSON_VALUE(value, '$.term') submissionLocation,
           case JSON_VALUE(s.project, '$.xy')
             when 'GEOMETRYCOLLECTION ()' then null
             else JSON_VALUE(s.project, '$.xy')
           end xy
         from dbo.Submissions s
         outer apply openjson(s.project, '$.province')
         cross join ( select
                        id,
                        regionId,
                        includeUnboundedSubmissions
                      from dbo.Tenants ) t
         where
           s.deletedAt is null
           and s.isSubmitted = 1 ) x

  left outer join dbo.Vocabulary v on v.term = x.submissionLocation
  left outer join dbo.VocabularyXrefRegion vxr on vxr.vocabularyId = v.id
  left outer join dbo.Regions submissionRegion on submissionRegion.id = vxr.regionId
  left outer join dbo.Regions tenantRegion on tenantRegion.id = x.regionId

  where
    (
      ( submissionRegion.geometry is not null and tenantRegion.geometry.STEnvelope().STBuffer(1).STContains(submissionRegion.geometry) = 1 )
      or
      ( submissionRegion.geometry is null and tenantRegion.geometry.STEnvelope().STBuffer(1).STIntersects(geometry::STGeomFromText(x.xy, 0)) = 1 )
    )
    or (
      coalesce(x.submissionLocation, x.xy) is null
      and x.includeUnboundedSubmissions = 1
    );