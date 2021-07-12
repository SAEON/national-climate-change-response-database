import { useState, createContext, useCallback } from 'react'
import { gql, useQuery } from '@apollo/client'
import Loading from '../../components/loading'
import Fade from '@material-ui/core/Fade'
import {
  projectFilters as projectFiltersConfig,
  adaptationFilters as adaptationFiltersConfig,
  mitigationFilters as mitigationFiltersConfig,
} from './filters/config'

export const context = createContext()

const PAGE_SIZE = 20

export default ({ children }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [projectFilters, _setProjectFilters] = useState(projectFiltersConfig)
  const [adaptationFilters, _setAdaptationFilters] = useState(adaptationFiltersConfig)
  const [mitigationFilters, _setMitigationFilters] = useState(mitigationFiltersConfig)

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
      query submissions(
        $limit: Int
        $offset: Int
        $isSubmitted: Boolean
        $projectFilters: JSON
        $mitigationFilters: JSON
        $adaptationFilters: JSON
      ) {
        submissions(
          limit: $limit
          offset: $offset
          isSubmitted: $isSubmitted
          projectFilters: $projectFilters
          mitigationFilters: $mitigationFilters
          adaptationFilters: $adaptationFilters
        ) {
          pageInfo {
            hasPreviousPage
            hasNextPage
            totalRecords
          }
          records {
            id
            isSubmitted
            project
            mitigation
            adaptation
            validationComments
            validationStatus
            createdBy {
              id
            }
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
        projectFilters,
        mitigationFilters,
        adaptationFilters,
      },
    }
  )

  if (loading) {
    return (
      <Fade key="loading-in" in={Boolean(loading)}>
        <Loading />
      </Fade>
    )
  }

  if (error) {
    throw error
  }

  const { submissions } = data
  const { pageInfo, records } = submissions
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
        records,
        hasPreviousPage,
        hasNextPage,
        totalRecords,
      }}
    >
      <Fade in={Boolean(data)} key="data-in">
        <div>{children}</div>
      </Fade>
    </context.Provider>
  )
}
