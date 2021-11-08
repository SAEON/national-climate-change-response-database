import { useState, createContext, useCallback, useContext } from 'react'
import { context as authContext } from '../../contexts/authorization'
import { gql, useQuery } from '@apollo/client'
import Loading from '../../components/loading'
import {
  projectFilters as projectFiltersConfig,
  adaptationFilters as adaptationFiltersConfig,
  mitigationFilters as mitigationFiltersConfig,
} from './filters/config'

export const context = createContext()

const PAGE_SIZE = 20

export default ({ children }) => {
  const { hasPermission } = useContext(authContext)
  const [currentPage, setCurrentPage] = useState(0)

  const [projectFilters, _setProjectFilters] = useState(
    Object.fromEntries(
      Object.entries(projectFiltersConfig).filter(([, { requiredPermission = undefined }]) =>
        requiredPermission ? hasPermission(requiredPermission) : true
      )
    )
  )

  const [adaptationFilters, _setAdaptationFilters] = useState(
    Object.fromEntries(
      Object.entries(adaptationFiltersConfig).filter(([, { requiredPermission = undefined }]) =>
        requiredPermission ? hasPermission(requiredPermission) : true
      )
    )
  )

  const [mitigationFilters, _setMitigationFilters] = useState(
    Object.fromEntries(
      Object.entries(mitigationFiltersConfig).filter(([, { requiredPermission = undefined }]) =>
        requiredPermission ? hasPermission(requiredPermission) : true
      )
    )
  )

  const setProjectFilters = useCallback(
    ({ field, value }) =>
      _setProjectFilters(projectFilters =>
        Object.assign(
          { ...projectFilters },
          {
            [field]: Object.assign({ ...projectFilters[field] }, { value }),
          }
        )
      ),
    []
  )

  const setAdaptationFilters = useCallback(
    ({ field, value }) =>
      _setAdaptationFilters(adaptationFilters =>
        Object.assign(
          { ...adaptationFilters },
          {
            [field]: Object.assign({ ...adaptationFilters[field] }, { value }),
          }
        )
      ),
    []
  )

  const setMitigationFilters = useCallback(
    ({ field, value }) =>
      _setMitigationFilters(mitigationFilters =>
        Object.assign(
          { ...mitigationFilters },
          {
            [field]: Object.assign({ ...mitigationFilters[field] }, { value }),
          }
        )
      ),
    []
  )

  const { error, loading, data } = useQuery(
    gql`
      query (
        $limit: Int
        $offset: Int
        $isSubmitted: Boolean
        $submissionStatus: String
        $projectFilters: JSON
        $mitigationFilters: JSON
        $adaptationFilters: JSON
      ) {
        pageInfo(
          limit: $limit
          offset: $offset
          isSubmitted: $isSubmitted
          submissionStatus: $submissionStatus
          projectFilters: $projectFilters
          mitigationFilters: $mitigationFilters
          adaptationFilters: $adaptationFilters
        ) {
          hasPreviousPage
          hasNextPage
          totalRecords
        }

        submissions(
          limit: $limit
          offset: $offset
          submissionStatus: $submissionStatus
          isSubmitted: $isSubmitted
          projectFilters: $projectFilters
          mitigationFilters: $mitigationFilters
          adaptationFilters: $adaptationFilters
        ) {
          id
          isSubmitted
          project
          mitigation
          adaptation
          submissionComments
          submissionStatus
          createdBy {
            id
          }
        }
      }
    `,
    {
      fetchPolicy: 'network-only',
      variables: {
        isSubmitted: true,
        limit: PAGE_SIZE,
        offset: currentPage * PAGE_SIZE,
        submissionStatus: hasPermission('validate-submission') ? undefined : 'Accepted',
        projectFilters,
        mitigationFilters,
        adaptationFilters,
      },
    }
  )

  if (loading) {
    return <Loading />
  }

  if (error) {
    throw error
  }

  const { submissions, pageInfo } = data
  const { hasPreviousPage, hasNextPage, totalRecords } = pageInfo

  return (
    <context.Provider
      value={{
        projectFilters,
        setProjectFilters,
        adaptationFilters,
        setAdaptationFilters,
        mitigationFilters,
        setMitigationFilters,
        currentPage,
        pageSize: PAGE_SIZE,
        previousPage: () => setCurrentPage(p => p - 1),
        nextPage: () => setCurrentPage(p => p + 1),
        records: submissions,
        hasPreviousPage,
        hasNextPage,
        totalRecords,
      }}
    >
      <div>{children}</div>
    </context.Provider>
  )
}
