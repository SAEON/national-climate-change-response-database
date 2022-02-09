import { HOSTNAME } from '../../../../../../config/index.js'
import { pool } from '../../../../../../mssql/pool.js'

export default async (details, { field, kind, tree }) => {
  if (kind === 'LIST') {
    return (
      await (await pool.connect()).request().query(
        `;with cte as (
          select
            id,
            json_value(s.project, '$.title') Title,
            concat('${HOSTNAME}/submissions/', id) [URL],
            p.[value] val
          from Submissions s
          cross apply openjson(s.${details}) p
          where p.[key] = '${field}'
        )
        
        select
          cte.TItle,
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
            t.name = 'regions'
            and vxv.parentId is not null
          );`
      )
    ).recordset
  } else {
    return (
      await (await pool.connect()).request().query(
        `select
          json_value(s.${details}, '$.title') Title,
          concat('${HOSTNAME}/submissions/', id) [URL],
          '${details}.${field}' Field,
          json_value(s.${details}, '$.${field}.term') [Incorrect term]
        from Submissions s
        where
          json_value(s.${details}, '$.${field}.term') is not null
          and json_value(s.${details}, '$.${field}.term') != ''
          and json_value(s.${details}, '$.${field}.term') not in (
            select
              v.term
            from Trees t
            join VocabularyXrefTree x on x.treeId = t.id
            join VocabularyXrefVocabulary vxv on vxv.childId = x.vocabularyId
            join Vocabulary v on v.id = vxv.childId
            where
              t.name = '${tree}'
              and vxv.parentId is not null
          );`
      )
    ).recordset
  }
}
