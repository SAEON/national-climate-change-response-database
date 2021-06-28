import seedUserModel from './user-model/index.js'
import seedAdmins from './admins/index.js'
import seedSysAdmins from './sysadmins/index.js'
import loadErmData from './erm/index.js'
import loadVocabularies from './vocabularies/index.js'

export default async (
  _,
  { userModel = false, erm = false, geometries = false, vocabularies = false },
  ctx
) => {
  const result = {}
  const { query } = ctx.mssql

  if (userModel) {
    await seedUserModel(query).then(() => console.info('User model seeded!'))
    await seedAdmins(query).then(() => console.info('Admin users seeded!'))
    await seedSysAdmins(query).then(() => console.info('System admin users seeded!'))
    result.users = 'Seeded roles, users, and userXRoles'
  }

  result.vocabularies = vocabularies ? await loadVocabularies(ctx) : false
  result.erm = erm ? await loadErmData(ctx) : false

  if (geometries) {
    throw new Error('Geometries are not supported at this time')
  }

  return result
}
