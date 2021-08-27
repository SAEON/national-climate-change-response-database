import { NCCRD_DEFAULT_ADMIN_EMAIL_ADDRESSES } from '../../config.js'
import logSql from '../../lib/log-sql.js'

const DEFAULT_ADMINS = NCCRD_DEFAULT_ADMIN_EMAIL_ADDRESSES.split(',')
  .filter(_ => _)
  .map(_ => _.toLowerCase())

export default async query => {
  if (DEFAULT_ADMINS.length) {
    try {
      const sql = `
      begin transaction ProvisionUsers
      begin try
  
        -- Users
        merge Users t
        using (
          ${DEFAULT_ADMINS.map(user => `select '${user}' emailAddress`).join(' union ')}
        ) s on s.emailAddress = t.emailAddress
        when not matched then insert (emailAddress)
        values (s.emailAddress);
  
        -- UserRoleXref
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
        values (s.userId, s.roleId);
      
      commit transaction ProvisionUsers;
      end try
      begin catch
        rollback transaction ProvisionUsers
      end catch`

      logSql(sql, 'Install admin users')
      await query(sql)
    } catch (error) {
      console.error('Unable to provision users', error.message)
      process.exit(1)
    }
  }
  return { defaultAdmins: DEFAULT_ADMINS }
}
