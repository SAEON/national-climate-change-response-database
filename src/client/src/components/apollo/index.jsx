import { ApolloProvider, ApolloClient, InMemoryCache, HttpLink } from '@apollo/client'
import { NCCRD_API_GQL_ADDRESS } from '../../config'

export default ({ children }) => (
  <ApolloProvider
    client={
      new ApolloClient({
        cache: new InMemoryCache({
          typePolicies: {},
        }),
        link: new HttpLink({
          uri: NCCRD_API_GQL_ADDRESS,
          credentials: 'include',
        }),
      })
    }
  >
    {children}
  </ApolloProvider>
)
