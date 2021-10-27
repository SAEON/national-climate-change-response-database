import permissions from '../../user-model/permissions.js'
import mssql from 'mssql'

export default async () => {
  for (const { name, description } of Object.values(permissions)) {
    const pool = await mssql.connect()
    const transaction = new mssql.Transaction(pool)
    await transaction.begin()

    // Insert permissions
    const upsert = new mssql.PreparedStatement(transaction)
    upsert.input('name', mssql.NVarChar)
    upsert.input('description', mssql.NVarChar)
    await upsert.prepare(`
      merge Permissions t
      using (
        select
          @name name,
          @description description
      ) s on s.name = t.name

      when not matched then insert (name, description)
        values (
          s.name,
          s.description
        )

      when matched then update
        set
          t.description = s.description;`)
    await upsert.execute({ name, description })
    await upsert.unprepare()

    // Commit transactions
    await transaction.commit()
  }
}
