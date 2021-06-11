export default {
  roles: async ({ id }, args, ctx) => {
    const { findUserRoles } = ctx.mssql.dataFinders
    return await findUserRoles(id)
  },
  permissions: async ({ id }, args, ctx) => {
    const { findUserPermissions } = ctx.mssql.dataFinders
    return await findUserPermissions(id)
  },
}
