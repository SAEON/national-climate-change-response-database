export default async ({ regionId }, args, ctx) => {
  const { findRegions } = ctx.mssql.dataFinders

  const regions = await findRegions(regionId)
  const region = regions[0]
  return region
}
