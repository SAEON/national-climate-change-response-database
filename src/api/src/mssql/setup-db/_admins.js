import query from '../_query.js'
import { NCCRD_DEFAULT_ADMIN_EMAIL_ADDRESSES } from '../../config.js'
const DEFAULT_ADMINS = NCCRD_DEFAULT_ADMIN_EMAIL_ADDRESSES.split(',')

export default async () => {
  if (DEFAULT_ADMINS.length) {
    await query(`
      insert into Users (emailAddress)
      values
        ${DEFAULT_ADMINS.map(
          (emailAddress, i, arr) => `('${emailAddress}')${i < arr.length - 1 ? ',' : ';'}`
        )}`)

    await query(`
      insert into UserRoleXref (userId, roleId)
      select
      u.id userId,
      r.id roleId
      from Users u
      join Roles r on r.name = 'admin'
      where u.emailAddress in (${DEFAULT_ADMINS.map(e => `'${e}'`).join(',')})`)
  }
  console.info('Default admins configured')
}
