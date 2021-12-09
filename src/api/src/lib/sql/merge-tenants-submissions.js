/**
 * The following inputs are required
 * @tenantId
 * @submissionId
 *
 *
 * Update all tenants, all submissions
 *  - input('tenantId', null)
 *  - input('submissionId', null)
 *
 * Update all tenants for a single submission
 *  - input('tenantId', null)
 *  - input('submissionId', uniqueidentifier)
 *
 * Update all submissions for a tenant
 *  - input('tenantId', int)
 *  - input('submissionId', null)
 *
 * Update single submission for a single tenant
 *  - input('tenantId', int)
 *  - input('submissionId', uniqueidentifier)
 */
export default `
declare @tenantId_ int;
set @tenantId_ = @tenantId;

declare @submissionId_ uniqueidentifier;
set @submissionId_ = @submissionId;

declare @isSubmitted_ bit;
set @isSubmitted_ = @isSubmitted;

;with _source as (
  select distinct
    x.tenantId,
    x.submissionId
  from
    (
      select
        s.id submissionId,
        t.id tenantId,
        t.regionId,
        t.includeUnboundedSubmissions,
        JSON_VALUE(value, '$.term') submissionLocation,
        case JSON_VALUE(s.project, '$.xy')
          when 'GEOMETRYCOLLECTION ()' then null
          else JSON_VALUE(s.project, '$.xy')
        end xy
      from
        dbo.Submissions s
        outer apply openjson(s.project, '$.province')
        cross join (
          select
            id,
            regionId,
            includeUnboundedSubmissions
          from
            dbo.Tenants
          where
            id = coalesce(@tenantId_, id)
        ) t
      where
        s.id = coalesce(@submissionId_, s.id)
        and s.deletedAt is null
        and s.isSubmitted = coalesce(@isSubmitted_, s.isSubmitted)
    ) x
    left outer join dbo.Vocabulary v on v.term = x.submissionLocation
    left outer join dbo.VocabularyXrefRegion vxr on vxr.vocabularyId = v.id
    left outer join dbo.Regions submissionRegion on submissionRegion.id = vxr.regionId
    left outer join dbo.Regions tenantRegion on tenantRegion.id = x.regionId
  where
    (
      (
        submissionRegion.geometry is not null
        and tenantRegion.geometry.STEnvelope().STBuffer(1).STContains(submissionRegion.geometry) = 1
      )
      or (
        submissionRegion.geometry is null
        and tenantRegion.geometry.STEnvelope().STBuffer(1).STIntersects(geometry :: STGeomFromText(x.xy, 0)) = 1
      )
    )
    or (
      coalesce(x.submissionLocation, x.xy) is null
      and x.includeUnboundedSubmissions = 1
    )
)

merge TenantXrefSubmission t using (
  select
    *
  from
    _source
) s on s.tenantId = t.tenantId
and s.submissionId = t.submissionId

when not matched by target then
insert
  (tenantId, submissionId)
values
  (s.tenantId, s.submissionId)

/**
 * (tenantId, submissionId) currently exists. Should it be deleted?
 * Select 1 in the "and" clause where row should be deleted
 *
 * The merge SQL works in the following 'contexts' depending on input
 *
 * (1) Re-creating tenant-submission matrix (@tenantId_ === null && @submissionId_ === null)
 * (2) New tenant - i.e. assign submissions to tenant (@tenantId_ !== null && @submissionId_ === null)
 * (3) New submission - i.e. assign tenants to submission: (@tenantId_ === null && @submissionId_ !== null)
 * (4) Explicit tenant/submission mapping - i.e assign/unassign tenant/submission: (@tenantId_ !== null && @submissionId_ !== null)
 */
when not matched by source
and (
  select
    case
      -- (1) If either t.tenantId or t.submissionId are not in _source, return 1
      when @tenantId_ is null
      and @submissionId_ is null then (
        select
          1
        where
          t.tenantId not in (
            select
              distinct tenantId
            from
              _source
          )
          or t.submissionId not in (
            select
              distinct submissionId
            from
              _source
          )
      )

      -- (2) If t.tenantId is in _source, return 1
      when @tenantId_ is not null
      and @submissionId_ is null then (
        select
          1
        where
          t.tenantId in (
            select
              distinct tenantId
            from
              _source
          )
      )

      -- (3) If t.submissionId is in _source, return 1
      when @tenantId_ is null
      and @submissionId_ is not null then (
        select
          1
        where
          t.submissionId in (
            select
              distinct submissionId
            from
              _source
          )
      )

      -- (4) If both t.tenantId and t.submissionId are in source, return 1
      when @tenantId_ is not null
      and @submissionId_ is not null then (
        select
          1
        where
          t.tenantId in (
            select
              distinct tenantId
            from
              _source
          )
          and t.submissionId in (
            select
              distinct submissionId
            from
              _source
          )
      ) -- (other, don't delete row)
      else 0
    end
) = 1 then delete;`
