import { join } from 'path'
import loadFile from '../../lib/load-file.js'
import getCurrentDirectory from '../../lib/get-current-directory.js'
import query from '../query.js'
import configureAdmins from './_admins.js'
import { NCCRD_API_RESET_SCHEMA } from '../../config.js'
import seedAuthorization from './authorization-seeds/index.js'

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

  await seedAuthorization().then(() => console.info('Database seeded!'))

  await configureAdmins()
})().catch(error => {
  console.error('Unable to provision schema', error.message)
  process.exit(1)
})
