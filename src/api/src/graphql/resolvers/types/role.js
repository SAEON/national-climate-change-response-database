export default {
  permissions: async ({ id }, args, ctx) => {
    const { findRolePermissions } = ctx.mssql.dataFinders
    return await findRolePermissions(id)
  },
}
