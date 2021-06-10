import { createContext } from 'react'
import { gql, useQuery } from '@apollo/client'
import Fade from '@material-ui/core/Fade'
import Loading from '../../components/loading'

export const context = createContext()

export default ({ children }) => {
  const { loading, error, data } = useQuery(gql`
    query {
      roles {
        id
        name
        description
      }

      users {
        id
        emailAddress
        roles {
          id
          name
          description
        }
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

  const { users, roles } = data

  return <context.Provider value={{ users, roles }}>{children}</context.Provider>
}
