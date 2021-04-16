import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/link-ws'
import { NCCRD_API_GQL_ADDRESS, NCCRD_API_GQL_SUBSCRIPTIONS_ADDRESS } from '../../config'

export default ({ children }) => (
  <ApolloProvider
    client={
      new ApolloClient({
        cache: new InMemoryCache({
          typePolicies: {},
        }),
        link: split(
          ({ query }) => {
            const definition = getMainDefinition(query)
            return (
              definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
            )
          },
          new WebSocketLink({
            uri: NCCRD_API_GQL_SUBSCRIPTIONS_ADDRESS,
            options: {
              reconnect: true,
            },
          }),
          new HttpLink({
            uri: NCCRD_API_GQL_ADDRESS,
            credentials: 'include',
          })
        ),
      })
    }
  >
    {children}
  </ApolloProvider>
)
