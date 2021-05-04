import { useContext, createContext } from 'react'
import { useQuery } from '@apollo/client'
import Loading from '../components/loading'
import { gql } from '@apollo/client'
import { context as authenticationContext } from './authentication'

export const context = createContext()

export default ({ children }) => {
  const { userInfo } = useContext(authenticationContext)
  const userRoles = userInfo?.userRoles

  const { loading, data } = useQuery(gql`
    query userRoles {
      userRoles {
        id
        name
        description
      }
    }
  `)

  if (loading) {
    return <Loading />
  }

  const applicationRoles = data?.userRoles
  const adminRoleId = applicationRoles && applicationRoles.find(({ name }) => name === 'admin').id

  return (
    <context.Provider
      value={{
        applicationRoles,
        isAuthenticated: Boolean(userInfo),
        isAdmin: Boolean(adminRoleId && userRoles?.includes(adminRoleId)),
        isAuthorized: (...roles) => {
          if (!applicationRoles) return false
          const roleId = applicationRoles.find(({ name }) => roles.includes(name)).id
          return userRoles?.includes(roleId)
        },
      }}
    >
      {children}
    </context.Provider>
  )
}
