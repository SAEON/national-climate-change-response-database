import { createContext, useContext } from 'react'
import { context as clientContext } from '../../../contexts/client-context'
import { gql, useQuery } from '@apollo/client'
import Loading from '../../../components/loading'
import { Div } from '../../../components/html-tags'

export const context = createContext()

export default ({ children }) => {
  const { id: tenantId } = useContext(clientContext)
  const { error, loading, data } = useQuery(
    gql`
      query incorrectSubmissionVocabularies($tenantId: Int!) {
        incorrectSubmissionVocabularies(tenantId: $tenantId)
      }
    `,
    {
      fetchPolicy: 'no-cache',
      variables: {
        tenantId: parseInt(tenantId, 10),
      },
    }
  )

  if (loading) {
    return (
      <Div
        sx={{
          marginBottom: theme => theme.spacing(2),
        }}
      >
        <Loading />
      </Div>
    )
  }

  if (error) {
    throw error
  }

  return (
    <context.Provider value={{ json: data.incorrectSubmissionVocabularies }}>
      {children}
    </context.Provider>
  )
}
