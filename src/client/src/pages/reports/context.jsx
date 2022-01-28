import { createContext } from 'react'
import { gql, useQuery } from '@apollo/client'

export const context = createContext()

export default ({ ...props }) => {
  const { loading, data, error } = useQuery(
    gql`
      query (
        $PROJECT_COUNT: Chart!
        $SPEND_BUDGET: Chart!
        $FUNDING_SOURCE: Chart!
        $OPERATIONAL_PROJECTS: Chart!
        $SECTOR_BUDGET: Chart!
        $SECTOR_FUNDING: Chart!
        $OPERATIONAL_PROJECTS_BY_YEAR: Chart!
      ) {
        SPEND_BUDGET: chart(id: $SPEND_BUDGET)
        FUNDING_SOURCE: chart(id: $FUNDING_SOURCE)
        OPERATIONAL_PROJECTS: chart(id: $OPERATIONAL_PROJECTS)
        PROJECT_COUNT: chart(id: $PROJECT_COUNT)
        SECTOR_BUDGET: chart(id: $SECTOR_BUDGET)
        SECTOR_FUNDING: chart(id: $SECTOR_FUNDING)
        OPERATIONAL_PROJECTS_BY_YEAR: chart(id: $OPERATIONAL_PROJECTS_BY_YEAR)
      }
    `,
    {
      fetchPolicy: 'no-cache',
      variables: {
        SPEND_BUDGET: 'SPEND_BUDGET',
        FUNDING_SOURCE: 'FUNDING_SOURCE',
        OPERATIONAL_PROJECTS: 'OPERATIONAL_PROJECTS',
        PROJECT_COUNT: 'PROJECT_COUNT',
        SECTOR_BUDGET: 'SECTOR_BUDGET',
        SECTOR_FUNDING: 'SECTOR_FUNDING',
        OPERATIONAL_PROJECTS_BY_YEAR: 'OPERATIONAL_PROJECTS_BY_YEAR',
      },
    }
  )

  if (error) {
    throw error
  }

  return <context.Provider value={{ loading, data }} {...props} />
}
