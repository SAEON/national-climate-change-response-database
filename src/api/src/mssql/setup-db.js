import { readdirSync, statSync } from 'fs'
import { join, normalize, sep } from 'path'
import { SUBMISSION_TEMPLATES_DIRECTORY } from '../config.js'
import { pool } from './pool.js'
import installUserModel from './install-user-model/index.js'
import seedAdmins from './install-admins/index.js'
import seedSysAdmins from './install-sysadmins/index.js'
import installSchema from './install-schema.js'
import seedDefaultTenant from './install-default-tenant/index.js'

const info = (...args) => console.info(...args)

/**
 * Initial schema
 */
;(async () => {
  await installSchema().then(() => info('Schema created (or already exists)'))
  await installUserModel().then(() => info('User model seeded!'))
  await seedAdmins().then(() => info('Admin users seeded!'))
  await seedSysAdmins().then(() => info('System admin users seeded!'))
  await seedDefaultTenant().then(() => info('Default tenant seeded!'))

  /**
   * Register existing template uploads
   * with SQL Server. Useful for system
   * migrations from old servers
   */
  const excelTemplates = readdirSync(SUBMISSION_TEMPLATES_DIRECTORY)
  for (const filename of excelTemplates) {
    try {
      const filePath = normalize(join(SUBMISSION_TEMPLATES_DIRECTORY, `.${sep}${filename}`))
      const createdAt = statSync(filePath)?.ctime?.toISOString() || new Date().toISOString()

      await pool.connect().then(pool =>
        pool
          .request()
          .input('filePath', filePath)
          .input('createdAt', createdAt)
          .query(
            `merge ExcelSubmissionTemplates t
            using (
              select
                @filePath filePath,
                @createdAt createdAt
            ) s on s.filePath = t.filePath
            when not matched then insert (filePath, createdAt)
            values (
              s.filePath,
              s.createdAt
            );`
          )
          .then(() => info('Registered Excel submission template', filename))
      )
    } catch (error) {
      console.error('Error registering existing templates', error.message)
      throw error
    }
  }
})().catch(error => {
  console.error(error.message)
  process.exit(1)
})
