import { join } from 'path'
import loadFile from '../../lib/load-file.js'
import getCurrentDirectory from '../../lib/get-current-directory.js'
import query from '../query.js'
import configureAdmins from './_admins.js'
import { NCCRD_API_RESET_SCHEMA } from '../../config.js'

const __dirname = getCurrentDirectory(import.meta)

;(async () => {
  if (NCCRD_API_RESET_SCHEMA) {
    await loadFile(join(__dirname, './sql/schema-drop.sql'))
      .then(sql => query(sql))
      .then(() => {
        console.info('SQL Schema dropped!')
      })
  }

  await loadFile(join(__dirname, './sql/schema.sql'))
    .then(sql => query(sql))
    .then(() => {
      console.info('SQL Schema created (or already exists)')
    })

  await loadFile(join(__dirname, './sql/seeds.sql'))
    .then(sql => query(sql))
    .then(() => {
      console.info('SQL Database seeds inserted!')
    })

  await configureAdmins()
})().catch(error => {
  console.error('Unable to provision schema', error.message)
  process.exit(1)
})
