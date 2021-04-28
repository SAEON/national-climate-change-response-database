export default async (_, { root, tree }, ctx) => {
  const { findVocabulary } = ctx.mongo.dataFinders
  const { trees, ...otherProps } = (await findVocabulary({ term: root, trees: tree }))[0] // eslint-disable-line
  return Object.assign(otherProps, { tree })
}
