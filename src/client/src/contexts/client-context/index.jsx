import { createContext } from 'react'
import { gql, useQuery } from '@apollo/client'

export const context = createContext()

/**
 * The client context is a combination of
 * tenant details and HTTP origin details
 */
export default ({ children }) => {
  const { error, loading, data } = useQuery(
    gql`
      query {
        clientContext {
          id
          hostname
          ipAddress
          userAgent
          origin
          isDefault
          title
          shortTitle
          frontMatter
          description
          logoUrl
          flagUrl
          region {
            id
            name
            centroid
            vocabulary {
              term
            }
          }
          theme
        }
      }
    `
  )

  if (loading) {
    return <p style={{ marginLeft: 16 }}>Loading...</p>
  }

  if (error) {
    const msg = 'Unable to retrieve client info. Is the server accessible?'
    console.error(msg, error)
    throw new Error(msg)
  }

  return (
    <context.Provider
      value={{
        ...data.clientContext,
      }}
    >
      {children}
    </context.Provider>
  )
}
