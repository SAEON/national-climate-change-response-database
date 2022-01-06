export default (tenants = [], tenantContext) => {
  const { isDefault: defaultTenant, hostname } = tenantContext

  let include = false

  if (tenants.length) {
    tenants.forEach(tenant => {
      if (tenant === 'default') {
        if (defaultTenant) {
          include = true
        }
      }

      if (tenant === '!default') {
        if (!defaultTenant) {
          include = true
        }
      }

      if (tenant === hostname) {
        include = true
      }
    })
  } else {
    include = true
  }

  return include
}
