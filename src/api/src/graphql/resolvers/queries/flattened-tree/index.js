import { pool } from '../../../../mssql/pool.js'

export default async (self, { treeName }) => {
  return (
    await (await pool.connect()).request().input('treeName', treeName).query(`
      select distinct
        v.term
      from Trees t
      join VocabularyXrefTree vxt on vxt.treeId = t.id
      join Vocabulary v on v.id = vxt.vocabularyId
      where
        t.name = @treeName
      order by
        v.term;`)
  ).recordset.map(({ term }) => term)
}
