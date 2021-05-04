import { join } from 'path'
import loadFile from '../../lib/load-file.js'
import getCurrentDirectory from '../../lib/get-current-directory.js'
import query from '../query.js'
import configureAdmins from './_admins.js'

const __dirname = getCurrentDirectory(import.meta)

try {
  await loadFile(join(__dirname, './schema.sql'))
    .then(sql => query(sql))
    .then(() => {
      console.info('SQL Schema created!')
    })

  await loadFile(join(__dirname, './seeds.sql'))
    .then(sql => query(sql))
    .then(() => {
      console.info('SQL Database seeds inserted!')
    })

  await configureAdmins()
} catch (error) {
  throw error
}
