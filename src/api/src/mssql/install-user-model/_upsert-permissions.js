import permissions from '../../user-model/permissions.js'
import { pool } from '../pool.js'
import mssql from 'mssql'

export default async () => {
  const transaction = new mssql.Transaction(await pool.connect())
  await transaction.begin()

  try {
    for (const { name, description } of Object.values(permissions)) {
      await transaction.request().input('name', name).input('description', description).query(`
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
    }

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
