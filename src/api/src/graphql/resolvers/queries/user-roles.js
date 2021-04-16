export default async (self, args, ctx) => {
  await ctx.user.ensureAuthenticated(ctx)
  const { findUserRoles } = await ctx.mongo.dataFinders
  return await findUserRoles({})
}
