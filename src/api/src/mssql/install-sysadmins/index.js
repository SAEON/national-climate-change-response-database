import { NCCRD_DEFAULT_SYSADMIN_EMAIL_ADDRESSES } from '../../config.js'
import { pool } from '../pool.js'

const USERS = NCCRD_DEFAULT_SYSADMIN_EMAIL_ADDRESSES.split(',')
  .filter(_ => _)
  .map(_ => _.toLowerCase())

export default async () => {
  if (USERS.length) {
    try {
      await pool.connect().then(pool => {
        const request = pool.request()
        USERS.forEach((user, i) => request.input(`user_${i}`, user))
        return request.query(`
          begin transaction ProvisionSysAdminUsers
          begin try
      
            -- Users
            merge Users t
            using (
              ${USERS.map((_, i) => `select @user_${i} emailAddress`).join(' union ')}
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
              join Roles r on r.name = 'sysadmin'
              where u.emailAddress in (${USERS.map((_, i) => `@user_${i}`).join(',')})
            ) s on s.userId = t.userId and s.roleId = t.roleId
            when not matched then insert (userId, roleId)
            values (s.userId, s.roleId);
          
          commit transaction ProvisionSysAdminUsers;
          end try
          begin catch
            rollback transaction ProvisionSysAdminUsers
          end catch`)
      })
    } catch (error) {
      console.error('Unable to provision sysadmin users', error.message)
      process.exit(1)
    }
  }
  return { defaultSysAdmins: USERS }
}
