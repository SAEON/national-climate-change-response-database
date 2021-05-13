export default async (_, { ids = undefined }, ctx) => {
  const { findProjects } = ctx.mssql.dataFinders
  return []
}
