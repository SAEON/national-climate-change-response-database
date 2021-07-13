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
  mode,
  project: generalDetails = {},
  mitigation: mitigationDetails = {},
  adaptation: adaptationDetails = {},
  isSubmitted,
}) => {
  const [syncError, setSynError] = useState(null)
  const apollo = useApolloClient()
  const [syncing, setSyncing] = useState(false)

  const [generalDetailsForm, setGeneralDetailsForm] = useState(
    convertGqlToFormInput(generalDetails || {})
  )
  const [mitigationDetailsForm, setMitigationDetailsForm] = useState(
    convertGqlToFormInput(mitigationDetails || {})
  )
  const [adaptationDetailsForm, setAdaptationDetailsForm] = useState(
    convertGqlToFormInput(adaptationDetails || {})
  )

  if (syncError) {
    throw syncError
  }

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
    debounce(async ({ project, mitigation, adaptation }) => {
      setSyncing(true)

      const { __validationStatus: validationStatus, __validationComments: validationComments } =
        project

      const {
        errors,
        data: { saveSubmission: submission },
      } = await apollo
        .mutate({
          fetchPolicy: 'no-cache',
          mutation: gql`
            mutation saveSubmission(
              $submissionId: ID!
              $project: JSON
              $mitigation: JSON
              $adaptation: JSON
              $validationStatus: JSON
              $validationComments: String
              $isSubmitted: Boolean
            ) {
              saveSubmission(
                submissionId: $submissionId
                project: $project
                mitigation: $mitigation
                adaptation: $adaptation
                validationStatus: $validationStatus
                validationComments: $validationComments
                isSubmitted: $isSubmitted
              ) {
                id
                isSubmitted
                project
                mitigation
                adaptation
                validationStatus
                validationComments
              }
            }
          `,
          variables: {
            submissionId,
            project: convertFormToGqlInput(project),
            mitigation: convertFormToGqlInput(mitigation),
            adaptation: convertFormToGqlInput(adaptation),
            validationStatus,
            validationComments,
            isSubmitted,
          },
        })
        .catch(error =>
          setSynError(
            new Error(
              `Error saving form (please make sure you have an internet connection. Refresh this page to continue editing the form): ${error.message}`
            )
          )
        )

      if (errors) {
        setSynError(new Error(`Unexpected syncing error: ${JSON.stringify(errors, null, 2)}`))
      }

      apollo.cache.modify({
        id: apollo.cache.identify(submission),
        fields: (value, details) => submission?.[details.fieldName] || value,
      })

      setSyncing(false)
    }, 1000),
    []
  )

  useEffect(() => {
    syncProgress({
      project: generalDetailsForm,
      mitigation: mitigationDetailsForm,
      adaptation: adaptationDetailsForm,
    })
    return () => {
      /**
       * TODO - Sync needs to be aborted if component is dismounted
       * I'm not sure how to do that with client.mutate(). The apollo
       * hooks do it automatically, so possibly look in the apollo client
       * source code (or refactor to use hooks - but that created an infinite
       * loop when I tried it)
       *
       * But it's not too big of a problem in any case
       */
    }
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
        syncing,
        mode,
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
