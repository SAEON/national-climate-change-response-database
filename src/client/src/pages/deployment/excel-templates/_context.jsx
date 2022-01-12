import { createContext } from 'react'
import { gql, useQuery } from '@apollo/client'
import Loading from '../../../components/loading'
import useTheme from '@mui/material/styles/useTheme'

export const context = createContext()

export default ({ children }) => {
  const theme = useTheme()
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
    return (
      <div
        style={{
          marginBottom: theme.spacing(2),
        }}
      >
        <Loading />
      </div>
    )
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
