import { createContext } from 'react'
import { gql, useQuery } from '@apollo/client'
import Loading from '../../../components/loading'

export const context = createContext()

export default ({ children }) => {
  const { error, loading, data } = useQuery(
    gql`
      query tenants {
        tenants {
          id
          hostname
          title
          shortTitle
          description
          theme
        }
      }
    `
  )

  if (loading) {
    return <Loading />
  }

  if (error) {
    throw error
  }

  return (
    <context.Provider
      value={{
        tenants: data.tenants,
      }}
    >
      {children}
    </context.Provider>
  )
}
