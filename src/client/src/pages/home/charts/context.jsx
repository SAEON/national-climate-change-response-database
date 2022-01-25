import { createContext } from 'react'
import { gql, useQuery } from '@apollo/client'

export const context = createContext()

export default ({ ...props }) => {
  const { loading, data, error } = useQuery(
    gql`
      query ($SPEND_BUDGET: Chart!) {
        SPEND_BUDGET: chart(id: $SPEND_BUDGET)
      }
    `,
    {
      variables: {
        SPEND_BUDGET: 'SPEND_BUDGET',
      },
    }
  )

  return <context.Provider value={{ loading, error, data: data }} {...props} />
}
