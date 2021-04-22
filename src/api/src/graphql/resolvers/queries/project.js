import mongodb from 'mongodb'
const { ObjectID } = mongodb

export default async (_, { id }, ctx) => {
  const { findProjects } = ctx.mongo.dataFinders
  return (await findProjects({ _id: ObjectID(id) }))[0]
}
