import { join, normalize, sep } from 'path'
import loadFile from '../../../../lib/load-file.js'
import getCurrentDirectory from '../../../../lib/get-current-directory.js'

const __dirname = getCurrentDirectory(import.meta)

export const dropSchema = async query =>
  loadFile(normalize(join(__dirname, `.${sep}sql${sep}drop-schema.sql`)))
    .then(sql => query(sql))
    .then(() => console.info('Schema dropped!'))

export const installSchema = async query =>
  await loadFile(normalize(join(__dirname, `.${sep}sql${sep}schema.sql`)))
    .then(sql => query(sql))
    .then(() => console.info('Schema created (or already exists)'))
