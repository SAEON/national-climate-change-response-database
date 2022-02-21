import { SKIP_INSTALLS } from '../config/index.js'
import installSchema from './install-schema.js'
import installUserModel from './install-user-model/index.js'
import installDefaultAdmins from './install-default-admins/index.js'
import installSysadmins from './install-sysadmins/index.js'
import installDefaultTenant from './install-default-tenant/index.js'
import installVocabulary from './install-vocabulary/index.js'
import installRegionGeometries from './install-region-geometries/index.js'

const info = (...args) => console.info(...args)

export default async () => {
  try {
    if (SKIP_INSTALLS) {
      info("======= WARNING ======= skipping schema installs. Don't do this on production")
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
    console.error('Unable to setup database', error)
    process.exit(1)
  }
}
