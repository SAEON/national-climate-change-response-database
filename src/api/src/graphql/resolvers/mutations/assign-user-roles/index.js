import logSql from '../../../../lib/log-sql.js'

export default async (self, { userId, roleIds }, ctx) => {
  const { query } = ctx.mssql

  // The sysadmin role can only be configured at application start time
  const sysadminId = (await query(`select id from Roles where name = 'sysadmin'`)).recordset[0].id
  roleIds = roleIds.filter(id => id !== sysadminId)

  const sql = `
    begin transaction T
      begin try

        delete from UserRoleXref
        where
          userId = ${userId}
          and roleId != ${sysadminId};

        ${
          roleIds.length
            ? `
              insert into UserRoleXref (userId, roleId)
              values ${roleIds.map(rId => `(${userId}, ${rId})`).join(',')};`
            : ''
        }

        select * from Users where id = ${userId};
      commit transaction T
      end try
      begin catch
        rollback transaction T
      end catch
  `

  logSql(sql, 'Assign user-roles')
  const result = await query(sql)
  return result.recordset[0]
}
