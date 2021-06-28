import { createContext, useState, useCallback, useMemo } from 'react'
import { gql, useQuery } from '@apollo/client'
import Loading from '../../loading'
import Fade from '@material-ui/core/Fade'
import getFormStatus from './_get-form-status'

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

export default ({ children, project = undefined }) => {
  const [generalDetailsForm, setGeneralDetailsForm] = useState({})
  const [mitigationDetailsForm, setMitigationDetailsForm] = useState({})
  const [adaptationDetailsForm, setAdaptationDetailsForm] = useState({})

  /* TYPE QUERY */

  const { error, loading, data } = useQuery(
    gql`
      ${CORE_FIELDS}
      query formFields(
        $projectInputType: String!
        $adaptationInputType: String!
        $mitigationInputType: String!
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
      }
    `,
    {
      variables: {
        projectInputType: 'ProjectInput',
        adaptationInputType: 'AdaptationInput',
        mitigationInputType: 'MitigationInput',
      },
    }
  )

  const projectFields = data?.projectFields.inputFields
  const mitigationFields = data?.mitigationFields.inputFields
  const adaptationFields = data?.adaptationFields.inputFields

  /* PROJECT FORM */

  const updateGeneralDetailsForm = useCallback(obj => {
    setGeneralDetailsForm(form => Object.assign({ ...form }, obj))
  }, [])

  const generalDetailsFormValidation = useMemo(
    () => getFormStatus(projectFields, generalDetailsForm),
    [projectFields, generalDetailsForm]
  )

  /* MITIGATION FORMS */

  const updateMitigationDetailsForm = useCallback(obj => {
    setMitigationDetailsForm(form => Object.assign({ ...form }, obj))
  }, [])

  const resetMitigationDetailsForm = useCallback(() => setMitigationDetailsForm({}), [])

  const mitigationFormsValidation = useMemo(
    () => getFormStatus(mitigationFields, mitigationDetailsForm),
    [mitigationFields, mitigationDetailsForm]
  )

  /* ADAPTATION FORMS */

  const updateAdaptationDetailsForm = useCallback(obj => {
    setAdaptationDetailsForm(form => Object.assign({ ...form }, obj))
  }, [])

  const resetAdaptationDetailsForm = useCallback(() => setAdaptationDetailsForm({}), [])

  const adaptationFormsValidation = useMemo(
    () => getFormStatus(adaptationFields, adaptationDetailsForm),
    [adaptationFields, adaptationDetailsForm]
  )

  if (loading) {
    return (
      <Fade in={loading} key="loading-in">
        <div>
          <Loading />
        </div>
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
        generalDetailsForm,
        generalDetailsFormValidation,
        updateGeneralDetailsForm,
        mitigationFields,
        mitigationDetailsForm,
        mitigationFormsValidation,
        updateMitigationDetailsForm,
        resetMitigationDetailsForm,
        adaptationFields,
        updateAdaptationDetailsForm,
        resetAdaptationDetailsForm,
        adaptationDetailsForm,
        adaptationFormsValidation,
      }}
    >
      <Fade in={Boolean(data)} key="data-in">
        <span>{children}</span>
      </Fade>
    </context.Provider>
  )
}
