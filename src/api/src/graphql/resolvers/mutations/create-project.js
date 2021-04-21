export default async (_, { projectDetails }, ctx) => {
  const { Projects } = await ctx.mongo.collections

  return (
    await Projects.insertOne({
      createdAt: new Date(),
      createdBy: 'TODO',
      ...projectDetails,
    })
  ).ops[0]
}
