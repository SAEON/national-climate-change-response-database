import logSql from '../../../../lib/log-sql.js'

// eslint-disable-next-line
export default async (_, { id }, ctx) => {
  const { query } = ctx.mssql
  const deletedAt = `'${new Date().toISOString()}'`

  const sql = `
    begin transaction D
     begin try
      
      update Projects
      set deletedAt = ${deletedAt}
      where id = ${id};

      update Adaptations
      set deletedAt = ${deletedAt};

      update ex
      set ex.deletedAt = ${deletedAt}
      from EmissionsDataXrefVocabTreeX ex
      inner join EmissionsData ed on ed.id = ex.emissionsDataId
      inner join Mitigations m on m.id = ed.mitigationId;

      update ed
      set ed.deletedAt = ${deletedAt}
      from EmissionsData ed
      inner join Mitigations m on m.id = ed.mitigationId;

      update Mitigations
      set deletedAt = ${deletedAt}
      where projectId = ${id};

      select id from Projects where id = ${id};
      commit transaction D
     end try
     begin catch
      rollback transaction D
     end catch`

  logSql(sql)

  const result = await query(sql)
  const deletedId = result?.recordset?.[0]?.id
  return deletedId
}
