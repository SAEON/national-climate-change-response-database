import { NCCRD_DEFAULT_SYSADMIN_EMAIL_ADDRESSES as _USERS } from '../../config.js'
import { pool } from '../pool.js'
import mssql from 'mssql'

export default async () => {
  const USERS = _USERS
    .split(',')
    .filter(_ => _)
    .map(_ => _.toLowerCase())

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

        // Upsert xref
        await transaction.request().input('user', user).query(`
          merge UserRoleXref t
          using (
            select
              u.id userId,
              r.id roleId
            from Users u
            join Roles r on r.name = 'sysadmin'
            where
              u.emailAddress = @user
          ) s on s.userId = t.userId and s.roleId = t.roleId
          when not matched then insert (userId, roleId)
          values (s.userId, s.roleId);`)

        console.info('sysadmin:', user)
      }

      // Commit the transaction
      await transaction.commit()
    } catch (error) {
      console.error('Unable to provision sysadmin users', error.message)
      await transaction.rollback()
      process.exit(1)
    }
  }
}
