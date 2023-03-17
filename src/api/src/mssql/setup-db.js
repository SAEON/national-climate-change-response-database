import { SKIP_INSTALLS, DEPLOYMENT_ENV } from '../config/index.js'
import installSchema from './install-schema.js'
import installUserModel from './install-user-model/index.js'
import installDefaultAdmins from './install-default-admins/index.js'
import installSysadmins from './install-sysadmins/index.js'
import installDefaultTenant from './install-default-tenant/index.js'
import installVocabulary from './install-vocabulary/index.js'
import installRegionGeometries from './install-region-geometries/index.js'
import registerTenantSubmissions from './register-tenant-submissions/index.js'
import logger from '../lib/logger.js'

const info = (...args) => logger.info(...args)

export default async () => {
  try {
    if (SKIP_INSTALLS) {
      if (DEPLOYMENT_ENV === 'production') {
        throw new Error(
          'Skipping default installs is not allowed on production. This is only for convenient restart times during development'
        )
      }
    } else {
      await installSchema().then(() => info('Installed schema\n'))
      await installRegionGeometries().then(() => info('Installed region geometries\n'))
      await installVocabulary().then(() => info('Installed vocabulary\n'))
      await installDefaultTenant().then(() => info('Finished installing default tenant\n'))
      await installUserModel().then(() => info('Installed user model\n'))
      await installSysadmins().then(() => info('Installed sysadmins\n'))
      await installDefaultAdmins().then(() => info('Installed admins\n'))
    }
  } catch (error) {
    logger.error('Unable to setup database', error)
    process.exit(1)
  }

  // This can be done asynchronously
  if (!SKIP_INSTALLS) {
    registerTenantSubmissions()
      .then(() => info('Tenant submissions registered'))
      .catch(error => {
        throw error
      })
  }
}
