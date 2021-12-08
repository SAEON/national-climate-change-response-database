import { createContext } from 'react'
import { gql, useQuery } from '@apollo/client'
import Loading from '../../../components/loading'

export const context = createContext()

export default ({ children }) => {
  const POLLING_INTERVAL = 1000

  const { error, loading, data, startPolling } = useQuery(
    gql`
      query submissionTemplates {
        submissionTemplates {
          id
          createdAt
          filePath
          createdBy {
            id
            emailAddress
          }
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

  startPolling(POLLING_INTERVAL)

  return (
    <context.Provider value={{ submissionTemplates: data.submissionTemplates }}>
      {children}
    </context.Provider>
  )
}
