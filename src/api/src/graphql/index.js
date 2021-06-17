import { ApolloServer } from 'apollo-server-koa'
import { NCCRD_API_GQL_ADDRESS } from '../config.js'
import _schema from './schema/index.js'

export const schema = _schema

export default new ApolloServer({
  uploads: false,
  schema,
  introspection: true,
  playground: {
    subscriptionEndpoint: `${NCCRD_API_GQL_ADDRESS}`,
    settings: {
      'editor.cursorShape': 'line',
      'request.credentials': 'include',
      'editor.theme': 'light',
    },
  },
  subscriptions: {
    onConnect: () => null,
    onDisconnect: () => null,
  },
  context: ({ ctx }) => {
    return ctx
  },
})
