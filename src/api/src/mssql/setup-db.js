import { readdirSync, statSync } from 'fs'
import { join, normalize, sep } from 'path'
import { SUBMISSION_TEMPLATES_DIRECTORY } from '../config.js'
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

  /**
   * Register existing template uploads
   * with SQL Server
   */
  const excelTemplates = readdirSync(SUBMISSION_TEMPLATES_DIRECTORY)
  console.info('Loading existing Excel submission templates', excelTemplates)
  for (const filename of excelTemplates) {
    const filePath = normalize(join(SUBMISSION_TEMPLATES_DIRECTORY, `.${sep}${filename}`))
    const createdAt = statSync(filePath)?.ctime?.toISOString() || new Date().toISOString()
    await query(`
      merge ExcelSubmissionTemplates t
      using (
        select
          '${sanitizeSqlValue(filePath)}' filePath,
          '${sanitizeSqlValue(createdAt)}' createdAt
      ) s on s.filePath = t.filePath
      when not matched then insert (filePath, createdAt)
      values (
        s.filePath,
        s.createdAt
      );`)
  }
})().catch(error => {
  console.error(error.message)
  process.exit(1)
})
