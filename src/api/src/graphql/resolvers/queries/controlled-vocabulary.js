export default async (_, { root, tree }, ctx) => {
  const { query } = ctx.mssql

  return (
    await query(`
    select
    p.*,
    children.id id
    
    from (
      select
      parent.id,
      parent.term,
      t.name tree
      
      from Vocabulary parent
      join VocabularyXrefTree vxt on vxt.vocabularyId = parent.id
      join VocabularyTrees t on t.id = vxt.vocabularyTreeId
      
      where
      parent.term = '${root}'
      and t.name = '${tree}'
    ) p
    join VocabularyXrefVocabulary vxv on vxv.parentId = p.id
    join Vocabulary children on children.id = vxv.childId
    
    for json auto, without_array_wrapper`)
  ).recordset[0]
}
