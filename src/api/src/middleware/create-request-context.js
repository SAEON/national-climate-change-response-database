import { makeDataFinders } from '../mssql/data-loaders/index.js'
import query from '../mssql/query.js'
import { pool } from '../mssql/pool.js'
import schema from '../graphql/schema/index.js'
import userModel from '../user-model/index.js'

/**
 * Look in middleware/cors.js
 * to see where app.context.tenant
 * is set (avoids unnecessary DB trip)
 */

export default app => async (ctx, next) => {
  console.log(ctx.session)
  app.context.userInfo = ctx.state.user

  app.context.gql = {
    schema,
  }

  app.context.mssql = {
    dataFinders: makeDataFinders(), // Request level batching
    query,
    pool,
  }

  app.context.user = userModel

  await next()
}
