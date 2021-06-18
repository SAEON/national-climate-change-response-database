import { join } from 'path'
import query from '../../../../mssql/query.js'
import loadFile from '../../../../lib/load-file.js'
import getCurrentDirectory from '../../../../lib/get-current-directory.js'
import seedUserModel from '../seed-database/user-model/index.js'
import seedAdmins from '../seed-database/admins/index.js'
import seedSysAdmins from '../seed-database/sysadmins/index.js'

const __dirname = getCurrentDirectory(import.meta)

/**
 * Initial schema
 */
;(async () => {
  await loadFile(join(__dirname, './sql/schema.sql'))
    .then(sql => query(sql))
    .then(() => console.info('Schema created (or already exists)'))
})()

export default async (_, { dropSchema = false }, ctx) => {
  const { query } = ctx.mssql
  const result = {}

  if (dropSchema) {
    await loadFile(join(__dirname, './sql/drop-schema.sql'))
      .then(sql => query(sql))
      .then(() => console.info('Schema dropped!'))
  }

  await loadFile(join(__dirname, './sql/schema.sql'))
    .then(sql => query(sql))
    .then(() => console.info('Schema created (or already exists)'))

  // If schema is recreated the user model needs to be reseeded
  if (dropSchema) {
    await seedUserModel(query).then(() => console.info('User model seeded!'))
    await seedAdmins(query).then(() => console.info('Admin users seeded!'))
    await seedSysAdmins(query).then(() => console.info('System admin users seeded!'))
  }

  return result
}
