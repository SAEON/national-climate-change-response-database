export default {
  roles: async ({ id: userId }, _, ctx) => {
    const { findUserRoles } = ctx.mssql.dataFinders
    return await findUserRoles(userId)
  },
  permissions: async ({ id: userId }, _, ctx) => {
    const { findUserPermissions } = ctx.mssql.dataFinders
    return await findUserPermissions(userId)
  },
  projects: async ({ id: userId }, _, ctx) => {
    const { findUserProjects } = ctx.mssql.dataFinders
    return await findUserProjects(userId)
  },
}
