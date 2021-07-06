import { join, normalize, sep } from 'path'
import loadFile from '../../../../lib/load-file.js'
import getCurrentDirectory from '../../../../lib/get-current-directory.js'
import logSql from '../../../../lib/log-sql.js'

const __dirname = getCurrentDirectory(import.meta)

export const dropSchema = async query =>
  loadFile(normalize(join(__dirname, `.${sep}sql${sep}drop-schema.sql`)))
    .then(async sql => {
      logSql(sql, 'Drop schema')
      await query(sql)
    })
    .then(() => console.info('Schema dropped!'))

export const installSchema = async query =>
  await loadFile(normalize(join(__dirname, `.${sep}sql${sep}schema.sql`)))
    .then(async sql => {
      logSql(sql, 'Create schema')
      await query(sql)
    })
    .then(() => console.info('Schema created (or already exists)'))
