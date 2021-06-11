import { makeDataFinders } from '../mssql/data-loaders/index.js'
import query from '../mssql/query.js'
import schema from '../graphql/schema/index.js'
import userModel, { ROLES, PERMISSIONS } from '../user-model/index.js'

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

  app.context.ROLES = ROLES

  app.context.PERMISSIONS = PERMISSIONS

  await next()
}
