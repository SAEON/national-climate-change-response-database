export default async (_, { root, tree }, ctx) => {
  const { query } = ctx.mssql

  const result = (
    await query(`
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
        parent.term = '${root}'
        and t.name = '${tree}'
      ) p
      left outer join VocabularyXrefVocabulary vxv on vxv.parentId = p.id and vxv.vocabularyTreeId = p.treeId
      left outer join Vocabulary children on children.id = vxv.childId
      
      for json auto, without_array_wrapper`)
  ).recordset[0]

  if (!result) {
    return null
  }

  const { children, ...record } = result
  return Object.assign(record, { children: children.map(({ id }) => id) })
}
