import upsertPermissions from './_upsert-permissions.js'
import upsertRoles from './_upsert-roles.js'

export default async () => {
  await upsertPermissions()
  await upsertRoles()
}
