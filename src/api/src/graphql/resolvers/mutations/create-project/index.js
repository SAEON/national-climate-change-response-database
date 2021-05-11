export default async (_, { projectForm, mitigationForms, adaptationForms, researchForms }, ctx) => {
  const { query } = ctx.mssql
  console.log('project form', projectForm)
  console.log('mitigation forms', mitigationForms)
  console.log('adaptation forms', adaptationForms)
  console.log('research forms', researchForms)

  return { id: 1 }
}
