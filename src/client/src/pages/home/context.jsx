import { createContext } from 'react'
import { gql, useQuery } from '@apollo/client'

export const context = createContext()

export default ({ ...props }) => {
  const { loading, data, error } = useQuery(
    gql`
      query ($PROJECT_COUNT: Chart!, $POINT_LOCATIONS: Chart!) {
        PROJECT_COUNT: chart(id: $PROJECT_COUNT)
        POINT_LOCATIONS: chart(id: $POINT_LOCATIONS)
      }
    `,
    {
      fetchPolicy: 'no-cache',
      variables: {
        PROJECT_COUNT: 'PROJECT_COUNT',
        POINT_LOCATIONS: 'POINT_LOCATIONS',
      },
    }
  )

  if (error) {
    throw error
  }

  return <context.Provider value={{ loading, data }} {...props} />
}
