import { join, normalize, sep } from 'path'
import logSql from '../../lib/log-sql.js'
import getCurrentDirectory from '../../lib/get-current-directory.js'
import { createReadStream } from 'fs'
import csv from 'csv'
const { parse } = csv

const __dirname = getCurrentDirectory(import.meta)

const upsertRoles = async (query, { removeUnmatchedBySource = false } = {}) => {
  const result = []
  const rolesPath = normalize(join(__dirname, `.${sep}auth-config${sep}roles.csv`))
  const parser = createReadStream(rolesPath).pipe(parse({ columns: true }))
  for await (let { name, description = '' } of parser) {
    name = name.trim()
    description = description.trim()

    const sql = `
      merge Roles t
      using (
        select
          '${sanitizeSqlValue(name)}' name,
          '${sanitizeSqlValue(description)}' description
      ) s on s.name = t.name
      when not matched by target then insert (name, description)
      values (
        s.name,
        s.description
      )
      ${
        removeUnmatchedBySource
          ? `when not matched by source and (t.name = '${sanitizeSqlValue(name)}')
             then delete`
          : ''
      }
      when matched then update set
        t.description = s.description;`

    logSql(sql, `Upsert roles (removeUnmatchedBySource: ${removeUnmatchedBySource})`)
    await query(sql)
    result.push({ addedRole: name })
  }
  return result
}

const upsertPermissions = async (query, { removeUnmatchedBySource = false } = {}) => {
  const result = []
  const permissionsPath = normalize(join(__dirname, `.${sep}auth-config${sep}permissions.csv`))
  const parser = createReadStream(permissionsPath).pipe(parse({ columns: true }))

  for await (let { name, description = '' } of parser) {
    name = name.trim()
    description = description.trim()

    const sql = `
      merge Permissions t
      using (
        select
          '${sanitizeSqlValue(name)}' name,
          '${sanitizeSqlValue(description)}' description
      ) s on s.name = t.name
      when not matched then insert (name, description)
      values (
        s.name,
        s.description
      )
      ${
        removeUnmatchedBySource
          ? `when not matched by source and (t.name = '${sanitizeSqlValue(name)}')
             then delete`
          : ''
      }      
      when matched then update set
        t.description = s.description;`

    logSql(sql, 'Upsert permissions')
    await query(sql)
    result.push({ addedPermission: name })
  }
  return result
}

/**
 * This function will also clean up roles
 * and permissions that have been removed
 * from the CSV file.
 *
 * This needs to happen here since roles
 * and permissions have to be deleted after
 * the xref tables inserts are deleted
 */
const upsertPermissionsXrefRoles = async query => {
  const result = []
  const xrefPath = normalize(join(__dirname, `.${sep}auth-config${sep}roles-x-permissions.csv`))
  const parser = createReadStream(xrefPath).pipe(parse({ columns: true }))

  for await (let { role, permission } of parser) {
    role = role.trim()
    permission = permission.trim()

    const sql = `
        merge PermissionRoleXref t
        using (
          select
            ( select id from Roles where name = '${sanitizeSqlValue(role)}') roleId,
            ( select id from Permissions where name = '${sanitizeSqlValue(
              permission
            )}') permissionId
        ) s on s.roleId = t.roleId and s.permissionId = t.permissionId
        when not matched by target then insert (roleId, permissionId)
        values (
          s.roleId,
          s.permissionId
        )
        when not matched by source
          and (t.roleId = ( select id from Roles where name = '${sanitizeSqlValue(role)}' ))
          and (t.permissionId = ( select id from Permissions where name = '${sanitizeSqlValue(
            permission
          )}' ))
        then delete;`

    logSql(sql, 'upsert role-permission')
    await query(sql)
    result.push({ addedRoleXrefPermission: [role, permission] })
  }

  /**
   * Clean up permissions by deleting all permissions that
   * are not assigned to at least one role
   */
  const sql2 = `
    delete from Permissions
    where id not in (select permissionId from PermissionRoleXref);`

  logSql(sql2, 'Remove unused permissions')
  await query(sql2)

  return result
}

export default async query => {
  return {
    roles: await upsertRoles(query),
    permissions: await upsertPermissions(query),
    permissionsXrefRoles: await upsertPermissionsXrefRoles(query),
  }
}
