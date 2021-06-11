import { useContext, createContext } from 'react'
import Loading from '../components/loading'
import { gql, useQuery } from '@apollo/client'
import { context as authenticationContext } from './authentication'

export const context = createContext()

const checkRole = (user, role) => Boolean(user?.roles.find(({ name }) => name === role))

export default ({ children }) => {
  const { user: sessionUser } = useContext(authenticationContext)
  const { loading, data } = useQuery(
    gql`
      query ($ids: [Int!]) {
        users(ids: $ids) {
          id
          roles {
            id
            name
            description
          }
          permissions {
            id
            name
            description
          }
        }
      }
    `,
    {
      variables: {
        ids: [sessionUser?.id || 0],
      },
    }
  )

  if (loading) {
    return <Loading />
  }

  const {
    users: [user],
  } = data || { users: [] }

  return (
    <context.Provider
      value={{
        isAuthenticated: Boolean(sessionUser),
        isAdmin: checkRole(user, 'admin'),
        hasRole: role => checkRole(user, role),
        hasPermission: permission =>
          Boolean(user?.permissions.find(({ name }) => name === permission)),
      }}
    >
      {children}
    </context.Provider>
  )
}
