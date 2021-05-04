export default async (self, args, ctx) => {
  await ctx.user.ensureAdmin(ctx)
  const { query } = ctx.mssql
  return (await query('select * from Roles')).recordset
}
