export default {
  roles: async ({ id: userId }, _, ctx) => {
    const { findUserRoles } = ctx.mssql.dataFinders
    return await findUserRoles(userId)
  },
  permissions: async ({ id: userId }, _, ctx) => {
    const { findUserPermissions } = ctx.mssql.dataFinders
    return await findUserPermissions(userId)
  },
  submissions: async ({ id: userId }, _, ctx) => {
    const { findUserSubmissions } = ctx.mssql.dataFinders
    return await findUserSubmissions(userId)
  },
}
