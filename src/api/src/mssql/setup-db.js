import query from './query.js'
import seedUserModel from '../graphql/resolvers/mutations/seed-database/user-model/index.js'
import seedAdmins from '../graphql/resolvers/mutations/seed-database/admins/index.js'
import seedSysAdmins from '../graphql/resolvers/mutations/seed-database/sysadmins/index.js'
import { installSchema } from '../graphql/resolvers/mutations/migrate-database/_queries.js'

/**
 * Initial schema
 */
;(async () => {
  await installSchema(query).then(() => console.info('Schema created (or already exists)'))
  await seedUserModel(query).then(() => console.info('User model seeded!'))
  await seedAdmins(query).then(() => console.info('Admin users seeded!'))
  await seedSysAdmins(query).then(() => console.info('System admin users seeded!'))
})().catch(error => {
  console.error(error.message)
  process.exit(1)
})
