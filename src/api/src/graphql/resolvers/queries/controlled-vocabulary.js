import { pool } from '../../../mssql/pool.js'

export default async (_, { root, roots, tree }) => {
  if (!root && !roots) {
    throw new Error('Either a vocabulary "root" or "roots" argument must be provided')
  }

  const _roots = roots?.length ? roots : [root]

  const request = (await pool.connect()).request()
  request.input('tree', tree)
  _roots.forEach((root, i) => request.input(`root_${i}`, root))

  const sql = `
    select
    p.id,
    p.term,
    p.term root,
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
      join Trees t on t.id = vxt.treeId
      
      where
      parent.term in (${_roots.map((_, i) => `@root_${i}`).join(',')})
      and t.name = @tree
    ) p
    left outer join VocabularyXrefVocabulary vxv on vxv.parentId = p.id and vxv.treeId = p.treeId
    left outer join Vocabulary children on children.id = vxv.childId
    
    for json auto;`

  const result = await request.query(sql)
  const results = result.recordset[0] || []

  return results.map(result => {
    const { children, ...record } = result
    return Object.assign(record, { children: children.map(({ id }) => id) })
  })
}
