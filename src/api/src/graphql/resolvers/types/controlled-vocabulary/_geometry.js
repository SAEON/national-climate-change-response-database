export default async ({ id: vocabularyId }, { simplify = true }, ctx) => {
  if (!simplify) {
    throw new Error('Not implemented (simplify = false)')
  }
  const { findRegionGeometry } = ctx.mssql.dataFinders
  const result = (await findRegionGeometry(vocabularyId))[0]
  return result?.geometry
}
