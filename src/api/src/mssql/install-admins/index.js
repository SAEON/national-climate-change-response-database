import { NCCRD_DEFAULT_ADMIN_EMAIL_ADDRESSES } from '../../config.js'
import { pool } from '../pool.js'

const USERS = NCCRD_DEFAULT_ADMIN_EMAIL_ADDRESSES.split(',')
  .filter(_ => _)
  .map(_ => _.toLowerCase())

export default async () => {
  if (USERS.length) {
    try {
      await pool.connect().then(pool => {
        const request = pool.request()
        USERS.forEach((user, i) => request.input(`user_${i}`, user))
        return request.query(`
          begin transaction ProvisionUsers
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
              join Roles r on r.name = 'admin'
              where u.emailAddress in (${USERS.map((_, i) => `@user_${i}`).join(',')})
            ) s on s.userId = t.userId and s.roleId = t.roleId
            when not matched then insert (userId, roleId)
            values (s.userId, s.roleId);
          
          commit transaction ProvisionUsers;
          end try
          begin catch
            rollback transaction ProvisionUsers
          end catch`)
      })
    } catch (error) {
      console.error('Unable to provision admin users', error.message)
      process.exit(1)
    }
  }
  return { defaultAdmins: USERS }
}
