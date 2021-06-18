import { useState, createContext, useCallback } from 'react'
import { gql, useQuery } from '@apollo/client'
import Loading from '../../components/loading'
import Fade from '@material-ui/core/Fade'

export const context = createContext()

const PAGE_SIZE = 20

const normalizeVocabularyFilters = f =>
  Object.entries(f)
    .filter(([, term]) => term)
    .map(([field, term]) => ({
      field,
      term,
    }))

export default ({ children }) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [filterContext, setFilterContext] = useState({
    ProjectFilters: {},
    MitigationFilters: {},
    AdaptationFilters: {},
  })

  const setFilter = useCallback((obj, entity) => {
    setFilterContext(filterContext =>
      Object.assign(
        { ...filterContext },
        {
          [`${entity}Filters`]: Object.assign(
            {
              ...filterContext[`${entity}Filters`],
            },
            obj
          ),
        }
      )
    )
  }, [])

  const setProjectFilter = useCallback(obj => setFilter(obj, 'Project'), [setFilter])
  const setMitigationFilter = useCallback(obj => setFilter(obj, 'Mitigation'), [setFilter])
  const setAdaptationFilter = useCallback(obj => setFilter(obj, 'Adaptation'), [setFilter])

  const { error, loading, data } = useQuery(
    gql`
      query projects(
        $distinct: Boolean
        $vocabularyFilters: [VocabularyFilterInput!]
        $mitigationFilters: MitigationFiltersInput
        $adaptationFilters: AdaptationFiltersInput
        $limit: Int
        $offset: Int
      ) {
        projects: projects(
          limit: $limit
          offset: $offset
          vocabularyFilters: $vocabularyFilters
          mitigationFilters: $mitigationFilters
          adaptationFilters: $adaptationFilters
        ) {
          id
          title
          description
          interventionType
          projectStatus
          validationStatus
          fundingStatus
          estimatedBudget
          hostSector
          hostSubSector
          province
          districtMunicipality
          localMunicipality
          mitigations {
            id
            mitigationType
            mitigationSubType
            interventionStatus
            cdmMethodology
            cdmExecutiveStatus
            hostSector
            hostSubSectorPrimary
            hostSubSectorSecondary
          }
          adaptations {
            id
            adaptationSector
            adaptationPurpose
            interventionStatus
            hazardFamily
            hazardSubFamily
            hazard
            subHazard
          }
        }

        filters: projects(
          distinct: $distinct
          vocabularyFilters: $vocabularyFilters
          mitigationFilters: $mitigationFilters
          adaptationFilters: $adaptationFilters
        ) {
          interventionType
          projectStatus
          validationStatus
          fundingStatus
          estimatedBudget
          hostSector
          hostSubSector
          province
          districtMunicipality
          localMunicipality
          mitigations {
            mitigationType
            mitigationSubType
            interventionStatus
            cdmMethodology
            cdmExecutiveStatus
            hostSector
            hostSubSectorPrimary
            hostSubSectorSecondary
          }
          adaptations {
            adaptationSector
            adaptationPurpose
            interventionStatus
            hazardFamily
            hazardSubFamily
            hazard
            subHazard
          }
        }
      }
    `,
    {
      variables: {
        limit: PAGE_SIZE,
        offset: currentPage * PAGE_SIZE,
        distinct: true,
        vocabularyFilters: normalizeVocabularyFilters(filterContext.ProjectFilters),
        mitigationFilters: {
          vocabularyFilters: normalizeVocabularyFilters(filterContext.MitigationFilters),
        },
        adaptationFilters: {
          vocabularyFilters: normalizeVocabularyFilters(filterContext.AdaptationFilters),
        },
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

  const { projects, filters } = data

  return (
    <context.Provider
      value={{
        filterContext,
        currentPage,
        pageSize: PAGE_SIZE,
        previousPage: currentPage === 0 ? undefined : () => setCurrentPage(p => p - 1),
        nextPage: () => setCurrentPage(p => p + 1),
        projects,
        filters,
        setProjectFilter,
        setMitigationFilter,
        setAdaptationFilter,
      }}
    >
      <Fade in={Boolean(data)} key="data-in">
        <div>{children}</div>
      </Fade>
    </context.Provider>
  )
}