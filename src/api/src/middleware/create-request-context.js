import { db as mongoDb, collections, getDataFinders } from '../mongo/index.js'
import { makeDataFinders } from '../mssql/index.js'
import schema from '../graphql/schema/index.js'
import userModel from '../user-model/index.js'

export default app => async (ctx, next) => {
  app.context.userInfo = ctx.state.user

  app.context.gql = {
    schema,
  }

  app.context.mongo = {
    db: mongoDb,
    collections,
    dataFinders: getDataFinders(), // Request level batching
  }

  app.context.mssql = {
    dataFinders: makeDataFinders(),
  }

  app.context.user = userModel

  await next()
}
