export default async (self, args, ctx) => {
  const { query } = ctx.mssql
  const result = await query(`select * from ExcelSubmissionTemplates`)
  return result.recordset
}
