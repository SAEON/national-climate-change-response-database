import * as roles from '../../user-model/roles.js'
import { pool } from '../pool.js'
import mssql from 'mssql'

export default async () => {
  const transaction = new mssql.Transaction(await pool.connect())
  await transaction.begin()

  try {
    for (const { name, description, permissions } of Object.values(roles)) {
      // Insert roles query
      await transaction.request().input('name', name).input('description', description).query(`
        merge Roles t
        using (
          select
            @name name,
            @description description
        ) s on s.name = t.name
        
        when not matched by target then insert (name, description)
          values (
            s.name,
            s.description
          )
          
        when matched then update
          set
            t.description = s.description;`)

      // Add permissions to roles
      for (const { name: permissionName } of permissions) {
        await transaction.request().input('roleName', name).input('permissionName', permissionName)
          .query(`
            merge PermissionXrefRole t
            using (
              select
                ( select id from Roles where name = @roleName ) roleId,
                ( select id from Permissions where name = @permissionName ) permissionId
            ) s on s.roleId = t.roleId and s.permissionId = t.permissionId
            
            when not matched by target then insert (roleId, permissionId)
              values (
                s.roleId,
                s.permissionId
              );`)
      }
    }

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}
