export default async (self, args, ctx) => {
  await ctx.user.ensureAdmin(ctx)
  const { findUsers } = await ctx.mongo.dataFinders
  return await findUsers({})
}
