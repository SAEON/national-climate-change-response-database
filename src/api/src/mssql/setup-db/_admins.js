import query from '../query.js'
import { NCCRD_DEFAULT_ADMIN_EMAIL_ADDRESSES } from '../../config.js'
const DEFAULT_ADMINS = NCCRD_DEFAULT_ADMIN_EMAIL_ADDRESSES.split(',').filter(_ => _)

export default async () => {
  if (DEFAULT_ADMINS.length) {
    await query(`
      merge Users t
      using (
        ${DEFAULT_ADMINS.map(user => `select '${user}' emailAddress`).join(' union ')}
      ) s on s.emailAddress = t.emailAddress
      when not matched then insert (emailAddress)
      values (s.emailAddress);`)

    await query(`
      merge UserRoleXref t
      using (
        select
        u.id userId,
        r.id roleId
        from Users u
        join Roles r on r.name = 'admin'
        where u.emailAddress in (${DEFAULT_ADMINS.map(e => `'${e}'`).join(',')})
      ) s on s.userId = t.userId and s.roleId = t.roleId
      when not matched then insert (userId, roleId)
      values (s.userId, s.roleId);`)
  }
  console.info('Default admins configured')
}
