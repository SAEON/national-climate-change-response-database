import { useContext, createContext, useCallback, useMemo } from 'react'
import { context as clientContext } from '../client-context'
import Loading from '../../components/loading'
import { gql, useQuery } from '@apollo/client'
import { context as authenticationContext } from '../authentication'

export const context = createContext()

export default ({ children }) => {
  const { user: sessionUser } = useContext(authenticationContext)
  const { id: tenantId } = useContext(clientContext)

  const { loading, data } = useQuery(
    gql`
      query user($id: Int!, $tenantId: ID!) {
        user(id: $id) {
          id
          context(tenantId: $tenantId) {
            id
            roles {
              id
              name
              description
              permissions {
                id
                name
                description
              }
            }
          }
        }
      }
    `,
    {
      variables: {
        id: sessionUser?.id || 0,
        tenantId,
      },
    }
  )

  const { user } = data || {}

  const permissions = useMemo(
    () =>
      user?.context[0].roles.map(({ permissions }) => permissions.map(({ name }) => name)).flat(),
    [user]
  )

  const hasPermission = useCallback(permission => permissions?.includes(permission), [permissions])

  if (loading) {
    return <Loading />
  }

  return (
    <context.Provider
      value={{
        user,
        isAuthenticated: Boolean(sessionUser),
        hasPermission,
      }}
    >
      {children}
    </context.Provider>
  )
}
