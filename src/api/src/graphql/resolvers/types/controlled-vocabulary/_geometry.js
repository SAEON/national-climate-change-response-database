export default async ({ tree, id: vocabularyId }, _, ctx) => {
  const { findGeometry } = ctx.mssql.dataFinders
  const result = (await findGeometry({ tree, vocabularyId }))[0]
  return result?.geometry
}
