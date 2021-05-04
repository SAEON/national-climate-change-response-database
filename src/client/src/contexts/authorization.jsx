import { useContext, createContext } from 'react'
import { useQuery } from '@apollo/client'
import Loading from '../components/loading'
import { gql } from '@apollo/client'
import { context as authenticationContext } from './authentication'

export const context = createContext()

export default ({ children }) => {
  const { userInfo } = useContext(authenticationContext)
  const roles = userInfo?.roles

  const { loading, data } = useQuery(gql`
    query roles {
      roles {
        id
        name
        description
      }
    }
  `)

  if (loading) {
    return <Loading />
  }

  const applicationRoles = data?.roles
  const adminRoleId = applicationRoles && applicationRoles.find(({ name }) => name === 'admin').id

  console.log(applicationRoles)

  return (
    <context.Provider
      value={{
        applicationRoles,
        isAuthenticated: Boolean(userInfo),
        isAdmin: Boolean(adminRoleId && roles?.includes(adminRoleId)),
        isAuthorized: (...roles) => {
          if (!applicationRoles) return false
          const roleId = applicationRoles.find(({ name }) => roles.includes(name)).id
          return roles?.includes(roleId)
        },
      }}
    >
      {children}
    </context.Provider>
  )
}
