export default async (_, { root, tree }, ctx) => {
  const { query } = ctx.mssql

  const result = (
    await query(`
      select
      p.id,
	    p.term,
	    p.tree,
      '${root}' root,
      children.id id
      
      from (
        select
        parent.id,
        parent.term,
        t.id treeId,
        t.name tree
        
        from Vocabulary parent
        join VocabularyXrefTree vxt on vxt.vocabularyId = parent.id
        join Trees t on t.id = vxt.treeId
        
        where
        parent.term = '${root}'
        and t.name = '${tree}'
      ) p
      left outer join VocabularyXrefVocabulary vxv on vxv.parentId = p.id and vxv.treeId = p.treeId
      left outer join Vocabulary children on children.id = vxv.childId
      
      for json auto, without_array_wrapper`)
  ).recordset[0]

  if (!result) {
    return null
  }

  const { children, ...record } = result
  return Object.assign(record, { children: children.map(({ id }) => id) })
}
