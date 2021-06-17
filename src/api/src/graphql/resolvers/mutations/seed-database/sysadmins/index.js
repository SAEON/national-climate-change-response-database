import { NCCRD_DEFAULT_SYSADMIN_EMAIL_ADDRESSES } from '../../../../../config.js'
const DEFAULT_SYSADMINS = NCCRD_DEFAULT_SYSADMIN_EMAIL_ADDRESSES.split(',').filter(_ => _)

export default async query => {
  if (DEFAULT_SYSADMINS.length) {
    try {
      await query(`
        begin transaction ProvisionUsers
        begin try
    
          -- Users
          merge Users t
          using (
            ${DEFAULT_SYSADMINS.map(user => `select '${user}' emailAddress`).join(' union ')}
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
            where u.emailAddress in (${DEFAULT_SYSADMINS.map(e => `'${e}'`).join(',')})
          ) s on s.userId = t.userId and s.roleId = t.roleId
          when not matched then insert (userId, roleId)
          values (s.userId, s.roleId);
        
        commit transaction ProvisionUsers;
        end try
        begin catch
          rollback transaction ProvisionUsers
        end catch`)
    } catch (error) {
      console.error('Unable to provision users', error.message)
      process.exit(1)
    }
  }
  console.info('Default admins configured')
}
