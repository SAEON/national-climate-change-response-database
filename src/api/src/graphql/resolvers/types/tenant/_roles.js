export default async (self, args, ctx) => {
  const { findRoles } = ctx.mssql.dataFinders
  const { roles: ids } = self['..']

  const roles = await Promise.all(ids.map(id => findRoles(id)))
  return roles.flat()
}
