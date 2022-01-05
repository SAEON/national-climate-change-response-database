import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { GQL_HOSTNAME } from '../../config'

export default ({ children }) => (
  <ApolloProvider
    client={
      new ApolloClient({
        cache: new InMemoryCache({
          typePolicies: {
            User: {
              fields: {
                roles: {
                  merge: (existing, incoming) => incoming,
                },
              },
            },
          },
        }),
        link: new HttpLink({
          uri: GQL_HOSTNAME,
          credentials: 'include',
        }),
      })
    }
  >
    {children}
  </ApolloProvider>
)
