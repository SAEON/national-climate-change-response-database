export default (permission, resourceOwner = false) =>
  op =>
  async (...args) => {
    const [, , ctx] = args
    const { user } = ctx
    if (!resourceOwner) {
      await user.ensurePermission({ ctx, permission })
    }
    return op(...args)
  }
