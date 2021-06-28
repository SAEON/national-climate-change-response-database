import { join } from 'path'
import query from './query.js'
import loadFile from '../lib/load-file.js'
import getCurrentDirectory from '../lib/get-current-directory.js'
import seedUserModel from '../graphql/resolvers/mutations/seed-database/user-model/index.js'
import seedAdmins from '../graphql/resolvers/mutations/seed-database/admins/index.js'
import seedSysAdmins from '../graphql/resolvers/mutations/seed-database/sysadmins/index.js'

const __dirname = getCurrentDirectory(import.meta)
const schemaPath = join(__dirname, './sql/schema.sql')

/**
 * Initial schema
 */
;(async () => {
  await loadFile(schemaPath)
    .then(sql => query(sql))
    .then(() => console.info('Schema created (or already exists)'))

  await seedUserModel(query).then(() => console.info('User model seeded!'))
  await seedAdmins(query).then(() => console.info('Admin users seeded!'))
  await seedSysAdmins(query).then(() => console.info('System admin users seeded!'))
})().catch(error => {
  console.error(error.message)
  process.exit(1)
})
