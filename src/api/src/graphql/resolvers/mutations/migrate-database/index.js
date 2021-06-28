import seedUserModel from '../seed-database/user-model/index.js'
import seedAdmins from '../seed-database/admins/index.js'
import seedSysAdmins from '../seed-database/sysadmins/index.js'
import { dropSchema as doDropSchema, installSchema } from './_queries.js'

export default async (_, { dropSchema = false }, ctx) => {
  const { query } = ctx.mssql
  const result = {}

  if (dropSchema) {
    await doDropSchema(query)
  }

  await installSchema(query)

  // If schema is recreated the user model needs to be reseeded
  if (dropSchema) {
    await seedUserModel(query).then(() => console.info('User model seeded!'))
    await seedAdmins(query).then(() => console.info('Admin users seeded!'))
    await seedSysAdmins(query).then(() => console.info('System admin users seeded!'))
  }

  return result
}
