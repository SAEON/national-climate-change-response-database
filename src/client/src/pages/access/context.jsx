import { createContext } from 'react'
import { gql, useQuery } from '@apollo/client'
import Fade from '@material-ui/core/Fade'
import Loading from '../../components/loading'

export const context = createContext()

export default ({ children }) => {
  const { loading, error, data } = useQuery(gql`
    query {
      users {
        id
        emailAddress
        name
        familyName
        roles {
          id
          name
          description
        }
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
    return (
      <Fade in={Boolean(loading)} key="loading-in">
        <Loading />
      </Fade>
    )
  }

  if (error) {
    throw error
  }

  const { users, roles, permissions } = data

  return <context.Provider value={{ users, roles, permissions }}>{children}</context.Provider>
}
