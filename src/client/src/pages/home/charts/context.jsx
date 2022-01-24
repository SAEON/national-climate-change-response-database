import { createContext } from 'react'
import { gql, useQuery } from '@apollo/client'

export const context = createContext()

export default ({ ...props }) => {
  const { loading, data, error } = useQuery(
    gql`
      query ($ANNUAL_FUNDING_BY_INTERVENTION: Chart!) {
        ANNUAL_FUNDING_BY_INTERVENTION: chart(id: $ANNUAL_FUNDING_BY_INTERVENTION)
      }
    `,
    {
      variables: {
        ANNUAL_FUNDING_BY_INTERVENTION: 'ANNUAL_FUNDING_BY_INTERVENTION',
      },
    }
  )

  return <context.Provider value={{ loading, error, data: data }} {...props} />
}
