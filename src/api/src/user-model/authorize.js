export default (permission, resourceOwner) =>
  op =>
  async (...args) => {
    const [, , ctx] = args
    const { user } = ctx
    if (!resourceOwner && user.info(ctx).id !== resourceOwner) {
      await user.ensurePermission({ ctx, permission })
    }
    return op(...args)
  }
