import { DEFAULT_ADMIN_EMAIL_ADDRESSES as USERS } from '../../config/index.js'
import upsertDefaultUsers from '../_lib/upsert-default-users.js'

export default async () => {
  await upsertDefaultUsers({
    USERS: USERS.split(',')
      .filter(_ => _)
      .map(_ => _.toLowerCase()),
    role: 'admin',
  })
}
