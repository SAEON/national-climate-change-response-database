export default {
  children: async (self, args, ctx) => {
    const { children = [], tree } = self
    const { findVocabulary } = ctx.mongo.dataFinders
    return (
      await findVocabulary({ _id: { $in: children }, trees: tree })
    ).map(({ trees, ...otherProps }) => Object.assign(otherProps, { tree })) //eslint-disable-line
  },
}
