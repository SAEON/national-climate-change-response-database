import schema from '../graphql/schema/index.js'
import userModel from '../user-model/index.js'

export default app => async (ctx, next) => {
  app.context.userInfo = ctx.state.user

  app.context.gql = {
    publicSchema: schema,
  }

  app.context.user = userModel

  await next()
}
