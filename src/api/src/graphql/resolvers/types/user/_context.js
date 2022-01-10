export default async ({ id: userId }, { tenantId = undefined }, ctx) => {
  const { findUserTenants } = ctx.mssql.dataFinders
  const tenants = await findUserTenants(userId)

  return tenants.filter(({ id }) => {
    if (tenantId) {
      return id === parseInt(tenantId, 10)
    }

    return true
  })
}
