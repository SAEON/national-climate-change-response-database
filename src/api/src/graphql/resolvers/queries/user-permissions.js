export default async (self, args, ctx) => {
  await ctx.user.ensureAuthenticated(ctx)
  const { findUserPermissions } = await ctx.mongo.dataFinders
  return await findUserPermissions({})
}
