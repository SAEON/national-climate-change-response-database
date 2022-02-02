import { createContext } from 'react'
import { gql, useQuery } from '@apollo/client'

export const context = createContext()

export default ({ ...props }) => {
  const { loading, data, error } = useQuery(
    gql`
      query (
        $PROJECT_COUNT: Chart!
        $ESTIMATED_BUDGET: Chart!
        $FUNDING_SOURCE: Chart!
        $SECTOR_BUDGET: Chart!
        $OPERATIONAL_PROJECTS_BY_YEAR: Chart!
        $POINT_LOCATIONS: Chart!
      ) {
        ESTIMATED_BUDGET: chart(id: $ESTIMATED_BUDGET)
        FUNDING_SOURCE: chart(id: $FUNDING_SOURCE)
        PROJECT_COUNT: chart(id: $PROJECT_COUNT)
        SECTOR_BUDGET: chart(id: $SECTOR_BUDGET)
        OPERATIONAL_PROJECTS_BY_YEAR: chart(id: $OPERATIONAL_PROJECTS_BY_YEAR)
        POINT_LOCATIONS: chart(id: $POINT_LOCATIONS)
      }
    `,
    {
      fetchPolicy: 'no-cache',
      variables: {
        ESTIMATED_BUDGET: 'ESTIMATED_BUDGET',
        FUNDING_SOURCE: 'FUNDING_SOURCE',
        PROJECT_COUNT: 'PROJECT_COUNT',
        SECTOR_BUDGET: 'SECTOR_BUDGET',
        OPERATIONAL_PROJECTS_BY_YEAR: 'OPERATIONAL_PROJECTS_BY_YEAR',
        POINT_LOCATIONS: 'POINT_LOCATIONS',
      },
    }
  )

  if (error) {
    throw error
  }

  return <context.Provider value={{ loading, data }} {...props} />
}
