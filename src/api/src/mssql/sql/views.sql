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
           JSON_VALUE(value, '$.term') submissionLocation
         from dbo.Submissions s
         outer apply openjson(s.project, '$.province')
         cross join ( select
                        id,
                        regionId
                      from dbo.Tenants ) t
         where
           s.deletedAt is null ) x
  join dbo.Vocabulary v on v.term = x.submissionLocation
  join dbo.VocabularyXrefRegion vxr on vxr.vocabularyId = v.id
  join dbo.Regions sr on sr.id = vxr.regionId
  join dbo.Regions tr on tr.id = x.regionId

  where
	  tr.geometry.STEnvelope().STBuffer(1).STContains(sr.geometry) = 1;