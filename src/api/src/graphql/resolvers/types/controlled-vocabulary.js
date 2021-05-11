export default {
  children: async (self, args, ctx) => {
    const { children = [], tree, term } = self
    const { findVocabulary } = ctx.mssql.dataFinders

    const items = await findVocabulary({
      ids: children,
      tree,
    })

    return (
      items?.map(({ children, ...record } = {}) => {
        return Object.assign(
          { ...record, root: term },
          { children: children?.map(({ id }) => id) || [] }
        )
      }) || []
    )
  },
}
