export default async (_, { projectForm, mitigationForms, adaptationForms, researchForms }, ctx) => {
  const { query } = ctx.mssql
  console.log('hi')

  return { id: 1 }
}
