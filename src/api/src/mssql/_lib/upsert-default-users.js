import mssql from 'mssql'
import { pool } from '../pool.js'

export default async ({ USERS, role }) => {
  if (USERS.length) {
    // Start transaction
    const transaction = new mssql.Transaction(await pool.connect())
    await transaction.begin()

    try {
      for (const user of USERS) {
        // Upsert user
        await transaction.request().input('user', user).query(`
          merge Users t
          using (
            select @user emailAddress
          ) s on s.emailAddress = t.emailAddress
          when not matched then insert (emailAddress)
          values (s.emailAddress);`)

        // Upsert xref (user/role/tenant)
        await transaction.request().input('user', user).input('role', role).query(`
          merge UserXrefRoleXrefTenant t
          using (
            select
              u.id userId,
              r.id roleId,
              ( select id from Tenants where isDefault = 1 ) tenantId
            from Users u
            join Roles r on r.name = @role
            where
              u.emailAddress = @user
          ) s on
            s.userId = t.userId
            and s.roleId = t.roleId
            and s.tenantId = t.tenantId
          when not matched then insert (userId, roleId, tenantId)
          values (s.userId, s.roleId, tenantId);`)

        console.info(`${role}:`, user)
      }

      // Commit the transaction
      await transaction.commit()
    } catch (error) {
      console.error(`Unable to provision ${role} users`, error.message)
      await transaction.rollback()
      process.exit(1)
    }
  }
}
