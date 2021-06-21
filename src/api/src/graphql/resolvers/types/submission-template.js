export default {
  createdBy: async ({ createdBy: userId }, _, ctx) => {
    const { findSubmissionTemplateUsers } = ctx.mssql.dataFinders
    return (await findSubmissionTemplateUsers(userId))[0]
  },
}
