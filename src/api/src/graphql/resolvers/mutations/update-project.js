import mongo from 'mongodb'
const { ObjectID } = mongo

export default async (_, args, ctx) => {
  await ctx.user.ensureDataScientist(ctx)
  const { Projects } = await ctx.mongo.collections

  const { id, ...otherArgs } = args
  const $set = { ...otherArgs, modifiedAt: new Date(), modifiedByUserId: 'TODO - get user id' }

  const response = await Projects.findOneAndUpdate(
    { _id: ObjectID(id) },
    {
      $set,
    },
    {
      returnOriginal: false,
      upsert: false,
    }
  )

  return response.value
}
