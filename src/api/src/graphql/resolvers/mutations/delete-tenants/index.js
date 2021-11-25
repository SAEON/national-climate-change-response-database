import mssql from 'mssql'
import { basename, sep, normalize, join } from 'path'
import { unlink } from 'fs'
import { IMAGES_DIRECTORY } from '../../../../config.js'

export default async (_, { ids }, ctx) => {
  const { pool } = ctx.mssql

  const transaction = new mssql.Transaction(await pool.connect())
  await transaction.begin()

  try {
    for (const id of ids) {
      const { logoUrl, flagUrl } = await transaction
        .request()
        .input('id', id)
        .query(`select logoUrl, flagUrl from Tenants where id = @id;`)
        .then(({ recordset: r }) => r[0])

      try {
        // Delete logo (if exists)
        if (logoUrl) {
          const filename = basename(logoUrl)
          const p = normalize(join(IMAGES_DIRECTORY, `${sep}${filename}`))
          await new Promise((y, x) => unlink(p, e => (e ? x(e) : y())))
        }

        // Delete flag image (if exists)
        if (flagUrl) {
          const filename = basename(flagUrl)
          const p = normalize(join(IMAGES_DIRECTORY, `${sep}${filename}`))
          await new Promise((y, x) => unlink(p, e => (e ? x(e) : y())))
        }
      } catch (error) {
        console.error('Unable to delete tenant assets. Clean up folder manually', error)
      }

      // Delete DB entry
      await transaction.request().input('id', id).query(`delete from Tenants where id = @id;`)
    }

    await transaction.commit()
    return ids
  } catch (error) {
    console.error('Error deleting tenants', ids)
    throw error
  }
}
