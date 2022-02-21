import { HOSTNAME, DEPLOYMENT_ENV } from '../../../../../../config/index.js'
import { pool } from '../../../../../../mssql/pool.js'

/**
 * The query is long running, this just speeds things up a bit
 */
export const DEV_QUERY_LIMIT = DEPLOYMENT_ENV === 'production' ? '' : 'top 10'

export default async (details, { tenantId, field, kind, tree }) => {
  if (kind === 'LIST') {
    return (
      await (
        await pool.connect()
      )
        .request()
        .input('tenantId', tenantId)
        .input('urlBase', `${HOSTNAME}/submissions/`)
        .input('tree', tree)
        .query(
          `;with cte as (
            select
              s.id,
              json_value(s.project, '$.title') Title,
              concat(@urlBase, s.id) [URL],
              p.[value] val
            from Submissions s
            join TenantXrefSubmission txs on txs.submissionId = s.id
            cross apply openjson(s.${details}) p
            where
              txs.tenantId = @tenantId
              and s.isSubmitted = 1
              and s.deletedAt is null
              and p.[key] = '${field}'
        )
        
        select ${DEV_QUERY_LIMIT}
          cte.id,
          cte.Title,
          cte.[URL],
          '${details}.${field}' Field,
          json_value(vocab.[value], '$.term') [Incorrect term],
          @tree Tree
        from cte
        cross apply openjson(cte.val) vocab
        where
          json_value(vocab.[value], '$.term') not in (
            select
              v.term
            from Trees t
              join VocabularyXrefTree x on x.treeId = t.id
              join VocabularyXrefVocabulary vxv on vxv.childId = x.vocabularyId
              join Vocabulary v on v.id = vxv.childId
            where
            t.name = @tree
            and vxv.parentId is not null
          );`
        )
    ).recordset
  } else {
    return (
      await (
        await pool.connect()
      )
        .request()
        .input('tenantId', tenantId)
        .input('urlBase', `${HOSTNAME}/submissions/`)
        .input('tree', tree)
        .query(
          `select ${DEV_QUERY_LIMIT}
            s.id,
            json_value(s.project, '$.title') Title,
            concat(@urlBase, s.id) [URL],
            '${details}.${field}' Field,
            json_value(s.${details}, '$.${field}.term') [Incorrect term],
            @tree Tree
          from Submissions s
          join TenantXrefSubmission txs on txs.submissionId = s.id
          where
            txs.tenantId = @tenantId
            and s.isSubmitted = 1
            and s.deletedAt is null
            and json_value(s.${details}, '$.${field}.term') is not null
            and json_value(s.${details}, '$.${field}.term') not in (
              select
                v.term
              from Trees t
              join VocabularyXrefTree x on x.treeId = t.id
              join VocabularyXrefVocabulary vxv on vxv.childId = x.vocabularyId
              join Vocabulary v on v.id = vxv.childId
              where
                t.name = @tree
                and vxv.parentId is not null
            );`
        )
    ).recordset
  }
}
