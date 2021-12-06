import { join, normalize, sep } from 'path'
import loadFile from '../lib/load-file.js'
import getCurrentDirectory from '../lib/get-current-directory.js'

import { pool } from './pool.js'

const __dirname = getCurrentDirectory(import.meta)

export default async () =>
  loadFile(normalize(join(__dirname, `.${sep}sql${sep}schema.sql`)))
    .then(sql => pool.connect().then(pool => pool.request().query(sql)))
    .then(() =>
      loadFile(normalize(join(__dirname, `.${sep}sql${sep}views.sql`))).then(sql =>
        pool.connect().then(pool => pool.request().query(sql))
      )
    )
