import { join, normalize, sep } from 'path'
import loadFile from '../lib/load-file.js'
import getCurrentDirectory from '../lib/get-current-directory.js'
import query from './query.js'

const __dirname = getCurrentDirectory(import.meta)

export default async () => {
  const sql = await loadFile(normalize(join(__dirname, `.${sep}sql${sep}schema.sql`)))
  await query(sql)
}
