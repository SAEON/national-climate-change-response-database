export default permission =>
  op =>
  async (...args) => {
    const [, , ctx] = args
    const { user } = ctx
    await user.ensurePermission({ ctx, permission: permission })
    return op(...args)
  }
