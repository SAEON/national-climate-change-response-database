import { createContext, useState } from 'react'
import { gql, useQuery } from '@apollo/client'
import Loading from '../../components/loading'

export const context = createContext()

export default ({ children }) => {
  const [selectedUsers, setSelectedUsers] = useState(() => new Set())

  const { loading, error, data } = useQuery(gql`
    query {
      users {
        id
        emailAddress
        name
        context {
          id
          hostname
          roles {
            id
            name
            description
          }
        }
      }

      tenants {
        id
        hostname
      }

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

      permissions {
        id
        name
        description
      }
    }
  `)

  if (loading) {
    return <Loading />
  }

  if (error) {
    throw error
  }

  const { users, roles, permissions, tenants } = data

  return (
    <context.Provider
      value={{ users, tenants, selectedUsers, setSelectedUsers, roles, permissions }}
    >
      {children}
    </context.Provider>
  )
}
