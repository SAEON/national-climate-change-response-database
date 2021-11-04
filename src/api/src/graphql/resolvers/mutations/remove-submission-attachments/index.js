import { unlink } from 'fs'
import { pool } from '../../../../mssql/pool.js'
import mssql from 'mssql'

export default async (_, { ids, submissionId }) => {
  const successfulDeletes = []

  for (const id of ids) {
    const transaction = new mssql.Transaction(await pool.connect())
    try {
      await transaction.begin()
      const filePath = (
        await transaction.request().input('submissionId', submissionId).input('id', id).query(`
          select
            *
          from WebSubmissionFiles
          where
            webSubmissionId = @submissionId
            and id = @id;`)
      ).recordset[0].filePath

      // Unlink the file
      await new Promise((resolve, reject) =>
        unlink(filePath, error => (error ? reject(error) : resolve()))
      )

      // Once the file is unlinked, delete the database entry
      await transaction.request().input('submissionId', submissionId).input('id', id).query(`
        delete from WebSubmissionFiles
        where
          webSubmissionId = @submissionId
          and id = @id;`)

      successfulDeletes.push(id)

      transaction.commit()
    } catch (error) {
      console.error('Error removing attachment', id, error)
      transaction.rollback()
    }
  }

  return { ids: successfulDeletes }
}
