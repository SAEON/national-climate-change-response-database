import { useContext, createContext } from 'react'
import Loading from '../components/loading'
import { gql, useQuery } from '@apollo/client'
import { context as authenticationContext } from './authentication'

export const context = createContext()

export default ({ children }) => {
  const { user: sessionUser } = useContext(authenticationContext)
  console.log('session user', sessionUser)

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
        ids: [sessionUser?.id],
      },
    }
  )

  console.log('user data', data)

  if (loading) {
    return <Loading />
  }

  const {
    users: [user],
  } = data || { users: [] }

  return (
    <context.Provider
      value={{
        user,
        isAuthenticated: Boolean(sessionUser),
        hasPermission: permission =>
          Boolean(user?.permissions.find(({ name }) => name === permission)),
      }}
    >
      {children}
    </context.Provider>
  )
}
