import { HOSTNAME } from '../../../../../../config/index.js'
import { pool } from '../../../../../../mssql/pool.js'

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
        
        select
          cte.id,
          cte.Title,
          cte.[URL],
          '${details}.${field}' Field,
          json_value(vocab.[value], '$.term') [Incorrect term]
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
          `select
            s.id,
            json_value(s.project, '$.title') Title,
            concat(@urlBase, s.id) [URL],
            '${details}.${field}' Field,
            json_value(s.${details}, '$.${field}.term') [Incorrect term]
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
