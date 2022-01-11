export default async (self, args, ctx) => {
  const { id: tenantId } = self
  const { userId } = self['..']
  const { findTenantSubmissions } = ctx.mssql.dataFinders
  const finder = findTenantSubmissions(userId)
  return await finder.load(tenantId)
}
