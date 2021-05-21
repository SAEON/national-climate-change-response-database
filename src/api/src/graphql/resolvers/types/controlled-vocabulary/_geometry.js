export default async ({ tree, id: vocabularyId }, { simplified = true }, ctx) => {
  const { findGeometry } = ctx.mssql.dataFinders
  const field = simplified ? 'geometry_simplified' : 'geometry'
  const result = (await findGeometry({ tree, vocabularyId, simplified }))[0]
  return result?.[field]
}
