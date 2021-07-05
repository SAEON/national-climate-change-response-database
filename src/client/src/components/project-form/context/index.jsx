import { createContext, useEffect, useState, useCallback, useMemo } from 'react'
import { gql, useQuery, useApolloClient } from '@apollo/client'
import Loading from '../../loading'
import Fade from '@material-ui/core/Fade'
import getFormStatus from './_get-form-status'
import convertGqlToFormInput_ from './_convert-gql-to-form-input'
import convertFormToGqlInput_ from './_convert-form-to-gql-input'
import debounce from '../../../lib/debounce'

export const convertGqlToFormInput = convertGqlToFormInput_
export const convertFormToGqlInput = convertFormToGqlInput_
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
  project: generalDetails = {},
  mitigation: mitigationDetails = {},
  adaptation: adaptationDetails = {},
}) => {
  const apollo = useApolloClient()
  const [generalDetailsForm, setGeneralDetailsForm] = useState(
    convertGqlToFormInput(generalDetails || {})
  )
  const [mitigationDetailsForm, setMitigationDetailsForm] = useState(
    convertGqlToFormInput(mitigationDetails || {})
  )
  const [adaptationDetailsForm, setAdaptationDetailsForm] = useState(
    convertGqlToFormInput(adaptationDetails || {})
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
    () =>
      setMitigationDetailsForm(form => {
        if (form?.fileUploads) {
          return { fileUploads: form.fileUploads }
        }
        return {}
      }),
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
    () =>
      setAdaptationDetailsForm(form => {
        if (form?.fileUploads) {
          return { fileUploads: form.fileUploads }
        }
        return {}
      }),
    []
  )

  const adaptationFormsValidation = useMemo(
    () => getFormStatus(adaptationFields, adaptationDetailsForm),
    [adaptationFields, adaptationDetailsForm]
  )

  // eslint-disable-next-line
  const syncProgress = useCallback(
    debounce(({ project, mitigation, adaptation }) => {
      console.log('syncing', project)
      apollo.mutate({
        fetchPolicy: 'no-cache',
        mutation: gql`
          mutation saveSubmission(
            $submissionId: ID!
            $project: JSON
            $mitigation: JSON
            $adaptation: JSON
          ) {
            saveSubmission(
              submissionId: $submissionId
              project: $project
              mitigation: $mitigation
              adaptation: $adaptation
            ) {
              id
            }
          }
        `,
        variables: {
          submissionId,
          project: convertFormToGqlInput(project),
          mitigation: convertFormToGqlInput(mitigation),
          adaptation: convertFormToGqlInput(adaptation),
          isSubmitted: false, // TODO - this needs to be dynamic for editing?
        },
        update: () => {}, // TODO - this is a place to handle collaborative editing
      })
    }, 1000),
    []
  )

  useEffect(() => {
    syncProgress({
      project: generalDetailsForm,
      mitigation: mitigationDetailsForm,
      adaptation: adaptationDetailsForm,
    })
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
