export default {
  roles: async ({ id }, args, ctx) => {
    const { findUserRoles } = ctx.mssql.dataFinders
    return await findUserRoles(id)
  },
}
