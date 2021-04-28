export default {
  id: async self => self._id,
  children: async ({ children = [] }, args, ctx) => {
    const { findVocabulary } = ctx.mongo.dataFinders
    return await findVocabulary({ _id: { $in: children } })
  },
}
