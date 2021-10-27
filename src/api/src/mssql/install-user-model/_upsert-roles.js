import roles from '../../user-model/roles.js'
import mssql from 'mssql'

export default async () => {
  for (const { name, description, permissions } of Object.values(roles)) {
    // Start transaction
    const pool = await mssql.connect()
    const transaction = new mssql.Transaction(pool)
    await transaction.begin()

    // Insert roles query
    const upsertRole = new mssql.PreparedStatement(transaction)
    upsertRole.input('name', mssql.NVarChar)
    upsertRole.input('description', mssql.NVarChar)
    await upsertRole.prepare(`
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
    await upsertRole.execute({ name, description })
    await upsertRole.unprepare()

    // Add permissions to roles
    for (const { name: permissionName } of permissions) {
      const upsertRolePermission = new mssql.PreparedStatement(transaction)
      upsertRolePermission.input('roleName', mssql.NVarChar)
      upsertRolePermission.input('permissionName', mssql.NVarChar)
      await upsertRolePermission.prepare(`
        merge PermissionRoleXref t
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
      await upsertRolePermission.execute({ roleName: name, permissionName })
      await upsertRolePermission.unprepare()
    }

    // Commit transaction
    await transaction.commit()
  }
}
