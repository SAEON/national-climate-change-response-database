export default async (_, { root, tree }, ctx) => {
  const { findVocabulary } = ctx.mongo.dataFinders
  return (await findVocabulary({ term: root, trees: tree }))[0]
}
