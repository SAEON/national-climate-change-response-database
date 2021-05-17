/**
 * This function is NOT a data finder. But the same
 * data finder (findVocabulary) is used in so many
 * places it's convenient to have this here
 */
export default async (ctx, id) => {
  const { findVocabulary } = ctx.mssql.dataFinders

  if (!id) {
    return null
  }

  const vocabulary = await findVocabulary(id)
  return vocabulary[0].term
}
