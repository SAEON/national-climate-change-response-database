import { makeDataFinders } from '../mssql/data-loaders/index.js'
import query from '../mssql/query.js'
import schema from '../graphql/schema/index.js'
import userModel from '../user-model/index.js'
import PERMISSIONS from '../user-model/permissions.js'

export default app => async (ctx, next) => {
  app.context.userInfo = ctx.state.user

  app.context.gql = {
    schema,
  }

  app.context.mssql = {
    dataFinders: makeDataFinders(), // Request level batching
    query,
  }

  app.context.user = userModel

  app.context.PERMISSIONS = PERMISSIONS

  await next()
}
