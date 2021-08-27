import { readdirSync, statSync } from 'fs'
import { join, normalize, sep } from 'path'
import { SUBMISSION_TEMPLATES_DIRECTORY } from '../config.js'
import query from './query.js'
import seedUserModel from './install-user-model/index.js'
import seedAdmins from './install-admins/index.js'
import seedSysAdmins from './install-sysadmins/index.js'
import installSchema from './install-schema.js'

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
    try {
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
    } catch (error) {
      console.error('Error registering existing templates', error.message)
    }
  }
})().catch(error => {
  console.error(error.message)
  process.exit(1)
})
