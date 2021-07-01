import { createContext, useEffect, useState, useCallback, useMemo } from 'react'
import { gql, useQuery, useApolloClient } from '@apollo/client'
import Loading from '../../loading'
import Fade from '@material-ui/core/Fade'
import getFormStatus from './_get-form-status'
import convertGqlToFormInput from './_convert-gql-to-form-input'
import debounce from '../../../lib/debounce'

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

export default ({
  children,
  submissionId,
  project: {
    mitigation: mitigationDetails = {},
    adaptation: adaptationDetails = {},
    ...generalDetails
  } = {},
}) => {
  const apollo = useApolloClient()
  const [generalDetailsForm, setGeneralDetailsForm] = useState(
    convertGqlToFormInput(generalDetails)
  )
  const [mitigationDetailsForm, setMitigationDetailsForm] = useState(
    convertGqlToFormInput(mitigationDetails)
  )
  const [adaptationDetailsForm, setAdaptationDetailsForm] = useState(
    convertGqlToFormInput(adaptationDetails)
  )

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

  /**
   * Don't remove file references
   * since the files are saved to the server
   * and need to be explicitly deleted
   */
  const resetMitigationDetailsForm = useCallback(
    () => setMitigationDetailsForm(form => ({ fileUploads: form.fileUploads })),
    []
  )

  const mitigationFormsValidation = useMemo(
    () => getFormStatus(mitigationFields, mitigationDetailsForm),
    [mitigationFields, mitigationDetailsForm]
  )

  /* ADAPTATION FORMS */

  const updateAdaptationDetailsForm = useCallback(obj => {
    setAdaptationDetailsForm(form => Object.assign({ ...form }, obj))
  }, [])

  /**
   * Don't remove file references
   * since the files are saved to the server
   * and need to be explicitly deleted
   */
  const resetAdaptationDetailsForm = useCallback(
    () => setAdaptationDetailsForm(form => ({ fileUploads: form.fileUploads })),
    []
  )

  const adaptationFormsValidation = useMemo(
    () => getFormStatus(adaptationFields, adaptationDetailsForm),
    [adaptationFields, adaptationDetailsForm]
  )

  // eslint-disable-next-line
  const syncProgress = useCallback(
    debounce(({ generalDetailsForm, mitigationDetailsForm, adaptationDetailsForm }) => {
      apollo.mutate({
        mutation: gql`
          mutation saveActiveSubmission(
            $submissionId: ID!
            $projectForm: JSON
            $mitigationForm: JSON
            $adaptationForm: JSON
          ) {
            saveActiveSubmission(
              submissionId: $submissionId
              projectForm: $projectForm
              mitigationForm: $mitigationForm
              adaptationForm: $adaptationForm
            ) {
              id
            }
          }
        `,
        variables: {
          submissionId,
          projectForm: generalDetailsForm,
          mitigationForm: mitigationDetailsForm,
          adaptationForm: adaptationDetailsForm,
        },
        update: () => {}, // TODO ?
      })
    }, 2000),
    []
  )

  useEffect(() => {
    syncProgress({ generalDetailsForm, mitigationDetailsForm, adaptationDetailsForm })
  }, [generalDetailsForm, mitigationDetailsForm, adaptationDetailsForm, syncProgress])

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
        submissionId,
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
