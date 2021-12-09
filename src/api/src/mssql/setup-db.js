import { readdirSync, statSync } from 'fs'
import { join, normalize, sep } from 'path'
import { SUBMISSION_TEMPLATES_DIRECTORY, SKIP_INSTALLS } from '../config.js'
import { pool } from './pool.js'
import installSchema from './install-schema.js'
import installUserModel from './install-user-model/index.js'
import installAdmins from './install-admins/index.js'
import installSysadmins from './install-sysadmins/index.js'
import installDefaultTenant from './install-default-tenant/index.js'
import installVocabulary from './install-vocabulary/index.js'
import installRegionGeometries from './install-region-geometries/index.js'

const info = (...args) => console.info(...args)

/**
 * Initial schema
 */
;(async () => {
  try {
    if (SKIP_INSTALLS) {
      info("======= WARNING ======= skipping schema installs. Don't do this on production")
    } else {
      await installSchema().then(() => info('Installed schema\n'))
      await installUserModel().then(() => info('Installed user model\n'))
      await installSysadmins().then(() => info('Installed sysadmins\n'))
      await installAdmins().then(() => info('Installed admins\n'))
      await installRegionGeometries().then(() => info('Installed region geometries\n'))
      await installVocabulary().then(() => info('Installed vocabulary\n'))
      await installDefaultTenant().then(() => info('Finished installing default tenant\n'))
    }
  } catch (error) {
    console.error('Unable to setup database', error)
    process.exit(1)
  }

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
