import { readdirSync, statSync } from 'fs'
import { join, normalize, sep } from 'path'
import { SUBMISSION_TEMPLATES_DIRECTORY } from '../config.js'
import query from './query.js'
import installUserModel from './install-user-model/index.js'
import seedAdmins from './install-admins/index.js'
import seedSysAdmins from './install-sysadmins/index.js'
import installSchema from './install-schema.js'

const info = msg => console.info(msg)

/**
 * Initial schema
 */
;(async () => {
  await installSchema().then(() => info('Schema created (or already exists)'))
  await installUserModel().then(() => info('User model seeded!'))
  await seedAdmins().then(() => info('Admin users seeded!'))
  await seedSysAdmins().then(() => info('System admin users seeded!'))

  /**
   * Register existing template uploads
   * with SQL Server
   *
   * Not user input - query doesn't need to be sanitized
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
