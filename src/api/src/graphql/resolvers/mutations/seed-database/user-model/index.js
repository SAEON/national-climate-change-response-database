import { join } from 'path'
import logSql from '../../../../../lib/log-sql.js'
import getCurrentDirectory from '../../../../../lib/get-current-directory.js'
import { createReadStream } from 'fs'
import csv from 'csv'
const { parse } = csv

const __dirname = getCurrentDirectory(import.meta)

const upsertRoles = async query => {
  console.info('Seeding roles')
  const parser = createReadStream(join(__dirname, './roles.csv')).pipe(parse({ columns: true }))

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
      when not matched then insert (name, description)
      values (
        s.name,
        s.description
      )
    when matched then update set
      t.description = s.description;`

    logSql(sql, 'Upsert roles')
    await query(sql)
  }
}

const upsertPermissions = async query => {
  console.info('Seeding permissions')
  const parser = createReadStream(join(__dirname, './permissions.csv')).pipe(
    parse({ columns: true })
  )

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
    when matched then update set
      t.description = s.description;`

    logSql(sql, 'Upsert permissions')
    await query(sql)
  }
}

const upsertPermissionsXrefRoles = async query => {
  console.info('Seeding role permissions')
  const parser = createReadStream(join(__dirname, './roles-x-permissions.csv')).pipe(
    parse({ columns: true })
  )

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
        when not matched then insert (roleId, permissionId)
        values (
          s.roleId,
          s.permissionId
        );`

    logSql(sql, 'upsert role-permission')
    await query(sql)
  }
}

export default async query => {
  await upsertRoles(query)
  await upsertPermissions(query)
  await upsertPermissionsXrefRoles(query)
}
