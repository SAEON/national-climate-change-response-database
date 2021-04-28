import mongodb from 'mongodb'
const { ObjectID } = mongodb

export default async (_, { ids = undefined }, ctx) => {
  const { findProjects } = ctx.mongo.dataFinders
  return await findProjects(ids ? { _id: { $in: ids.map(id => ObjectID(id)) } } : {})
}
