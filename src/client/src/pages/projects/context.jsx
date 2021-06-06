import { useState, createContext, useCallback } from 'react'
import { gql, useQuery } from '@apollo/client'
import Loading from '../../components/loading'

export const context = createContext()

const normalizeVocabularyFilters = f =>
  Object.entries(f)
    .filter(([, term]) => term)
    .map(([field, term]) => ({
      field,
      term,
    }))

export default ({ children }) => {
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

  console.log('d', normalizeVocabularyFilters(filterContext.AdaptationFilters))

  const { error, loading, data } = useQuery(
    gql`
      query projects(
        $distinct: Boolean
        $vocabularyFilters: [VocabularyFilterInput!]
        $mitigationFilters: MitigationFiltersInput
        $adaptationFilters: AdaptationFiltersInput
      ) {
        projects: projects(
          vocabularyFilters: $vocabularyFilters
          mitigationFilters: $mitigationFilters
          adaptationFilters: $adaptationFilters
        ) {
          id
          title
          description
          projectManager
          link
          startDate
          endDate
          validationComments
          fundingOrganisation
          fundingPartner
          budgetLower
          budgetUpper
          hostOrganisation
          hostPartner
          alternativeContact
          alternativeContactEmail
          leadAgent
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
            title
            description
            carbonCredit
            volMethodology
            goldStandard
            vcs
            yx
            otherCarbonCreditStandard
            otherCarbonCreditStandardDescription
            cdmProjectNumber
            cdmStatus
            isResearch
            researchDescription
            energyOrEmissionsData
            energyData
            emissionsData
            researchType
            researchTargetAudience
            researchAuthor
            researchPaper
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
            title
            description
            startDate
            endDate
            yx
            isResearch
            interventionStatus
            researchDescription
            researchType
            researchTargetAudience
            researchAuthor
            researchPaper
            adaptationSector
            adaptationPurpose
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
    return <Loading />
  }

  if (error) {
    throw error
  }

  const { projects, filters } = data

  return (
    <context.Provider
      value={{
        filterContext,
        projects,
        filters,
        setProjectFilter,
        setMitigationFilter,
        setAdaptationFilter,
      }}
    >
      {children}
    </context.Provider>
  )
}
