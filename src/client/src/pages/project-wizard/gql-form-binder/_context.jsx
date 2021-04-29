import { createContext, useEffect, useState, useCallback } from 'react'
import { gql, useQuery } from '@apollo/client'
import Loading from '../../../components/loading'
import Fade from '@material-ui/core/Fade'

export const context = createContext()

const CORE_FIELDS = gql`
  fragment CoreFields on __Type {
    inputFields {
      name
      description
      type {
        name
        enumValues {
          name
          description
        }
        ofType {
          name
          enumValues {
            name
            description
          }
        }
      }
    }
  }
`

export default ({ children }) => {
  const [projectForm, setProjectForm] = useState({})
  const [mitigationsForm, setMitigationsForm] = useState([])
  const [adaptationsForm, setAdaptationsForm] = useState([])
  const [researchForm, setResearchForm] = useState([])

  const updateProjectForm = useCallback(obj => {
    setProjectForm(projectForm => Object.assign({ ...projectForm }, obj))
  }, [])

  const { error, loading, data } = useQuery(
    gql`
      ${CORE_FIELDS}
      query formFields(
        $projectInputType: String!
        $adaptationInputType: String!
        $mitigationInputType: String!
        $researchInputType: String!
      ) {
        projectFields: __type(name: $projectInputType) {
          ...CoreFields
        }
        mitigationFields: __type(name: $mitigationInputType) {
          ...CoreFields
        }
        adaptationFields: __type(name: $adaptationInputType) {
          ...CoreFields
        }
        researchFields: __type(name: $researchInputType) {
          ...CoreFields
        }
      }
    `,
    {
      variables: {
        projectInputType: 'ProjectInput',
        adaptationInputType: 'AdaptationInput',
        mitigationInputType: 'MitigationInput',
        researchInputType: 'ResearchInput',
      },
    }
  )

  const projectFields = data?.projectFields.inputFields
  const mitigationFields = data?.mitigationFields.inputFields
  const adaptationFields = data?.adaptationFields.inputFields
  const researchFields = data?.researchFields.inputFields

  /**
   * Reset form completely
   * on component dismount
   */
  useEffect(
    () => () => {
      setProjectForm({})
      setMitigationsForm([])
      setAdaptationsForm([])
      setResearchForm([])
    },
    []
  )

  /**
   * Update form on type-load
   */
  useEffect(() => {
    if (projectFields) {
      setProjectForm(
        Object.fromEntries(
          projectFields.map(({ name, type }) => {
            const enumValues = type?.enumValues || type?.ofType?.enumValues
            return [name, enumValues?.[0].name || '']
          })
        )
      )
    }

    setMitigationsForm([])
    setAdaptationsForm([])
    setResearchForm([])
  }, [projectFields, mitigationFields, adaptationFields, researchFields])

  if (loading) {
    return (
      <Fade in={loading} key="loading-in">
        <span>
          <Loading msg="Loading form fields" />
        </span>
      </Fade>
    )
  }

  if (error) {
    throw error
  }

  return (
    <context.Provider
      value={{
        projectFields,
        projectForm,
        updateProjectForm,
        mitigationFields,
        mitigationsForm,
        adaptationFields,
        adaptationsForm,
        researchFields,
        researchForm,
      }}
    >
      <Fade in={Boolean(data)} key="data-in">
        <span>{children}</span>
      </Fade>
    </context.Provider>
  )
}
