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
    SubmissionFilters: {},
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

  const setSubmissionFilter = useCallback(obj => setFilter(obj, 'Submission'), [setFilter])
  const setMitigationFilter = useCallback(obj => setFilter(obj, 'Mitigation'), [setFilter])
  const setAdaptationFilter = useCallback(obj => setFilter(obj, 'Adaptation'), [setFilter])

  const { error, loading, data } = useQuery(
    gql`
      query submissions(
        $vocabularyFilters: [VocabularyFilterInput!]
        $mitigationFilters: MitigationFiltersInput
        $adaptationFilters: AdaptationFiltersInput
        $limit: Int
        $offset: Int
      ) {
        submissions(
          limit: $limit
          offset: $offset
          vocabularyFilters: $vocabularyFilters
          mitigationFilters: $mitigationFilters
          adaptationFilters: $adaptationFilters
        ) {
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
    `,
    {
      variables: {
        limit: PAGE_SIZE,
        offset: currentPage * PAGE_SIZE,
        vocabularyFilters: normalizeVocabularyFilters(filterContext.SubmissionFilters),
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

  const { submissions } = data

  return (
    <context.Provider
      value={{
        filterContext,
        currentPage,
        pageSize: PAGE_SIZE,
        previousPage: currentPage === 0 ? undefined : () => setCurrentPage(p => p - 1),
        nextPage: () => setCurrentPage(p => p + 1),
        submissions,
        filters: [],
        setSubmissionFilter,
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
