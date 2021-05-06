import DataLoader from 'dataloader'
import query from '../query.js'

export default () =>
  new DataLoader(
    async keys =>
      keys.map(
        async (key, i) =>
          (
            await query(
              keys
                .map(
                  ({ ids, tree }) => `
                    select
                    p.id,
                    p.term,
                    p.tree,
                    children.id id
                    
                    from (
                      select
                      parent.id,
                      parent.term,
                      t.id treeId,
                      t.name tree
                    
                      from Vocabulary parent
                      join VocabularyXrefTree vxt on vxt.vocabularyId = parent.id
                      join VocabularyTrees t on t.id = vxt.vocabularyTreeId
                    
                      where
                      parent.id in (${ids.join(',')})
                      and t.name = '${tree}'
                    ) p
                    join VocabularyXrefVocabulary vxv on vxv.parentId = p.id and vxv.vocabularyTreeId = p.treeId
                    join Vocabulary children on children.id = vxv.childId
                    
                    for json auto`
                )
                .join(';')
            )
          ).recordsets[i]
      ),
    {
      batch: true,
      maxBatchSize: 250,
      cache: true,
    }
  )
