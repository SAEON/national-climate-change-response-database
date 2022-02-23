/**
 * This function decorates GraphQL resolvers (self, args, ctx) => ...
 */
export const authorizeGql =
  ({ permission, resourceOwner = -1, validTenants = undefined }) =>
  op =>
  async (...args) => {
    const [, , ctx] = args
    const { user } = ctx
    if (resourceOwner !== user.info(ctx).id) {
      await user.ensurePermission({ ctx, permission, validTenants })
    }
    return op(...args)
  }

/**
 * This function decorates HTTP routes (ctx) => ...
 */
export const authorizeHttp =
  ({ permission, resourceOwner = -1, validTenants = undefined }) =>
  op =>
  async (...args) => {
    const [ctx] = args
    const { user } = ctx
    if (resourceOwner !== user.info(ctx).id) {
      await user.ensurePermission({ ctx, permission, validTenants })
    }
    return op(...args)
  }
