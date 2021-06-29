export default {
  createdBy: async ({ createdBy: userId }, _, ctx) => {
    const { findSubmissionTemplateUsers } = ctx.mssql.dataFinders
    if (!userId) return null
    return (await findSubmissionTemplateUsers(userId))[0]
  },
}
