import { createContext, useEffect, useState, useCallback, useMemo } from 'react'
import { gql, useQuery } from '@apollo/client'
import Loading from '../../../components/loading'
import Fade from '@material-ui/core/Fade'
import { getFormStatus, getMultiFormsStatus } from './_get-form-status'

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
  const [mitigationForms, setMitigationForms] = useState([])
  const [adaptationForms, setAdaptationForms] = useState([])
  const [researchForms, setResearchForms] = useState([])

  /* TYPE QUERY */

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

  /* PROJECT FORM */

  const updateProjectForm = useCallback(obj => {
    setProjectForm(projectForm => Object.assign({ ...projectForm }, obj))
  }, [])

  const projectFormValidation = useMemo(() => getFormStatus(projectFields, projectForm), [
    projectFields,
    projectForm,
  ])

  /* MITIGATION FORMS */

  const updateMitigationForm = useCallback((obj, i) => {
    setMitigationForms(forms =>
      forms.map((form, _i) => (i === _i ? Object.assign({ ...form }, { ...obj }) : form))
    )
  }, [])

  const addMitigationForm = useCallback(() => {
    setMitigationForms(forms => [...forms, {}])
  }, [])

  const removeMitigationForm = useCallback(i => {
    setMitigationForms(forms => forms.filter((form, _i) => i !== _i))
  }, [])

  const mitigationFormsValidation = useMemo(
    () => getMultiFormsStatus(mitigationForms.map(form => getFormStatus(mitigationFields, form))),
    [mitigationFields, mitigationForms]
  )

  /* ADAPTATION FORMS */

  const updateAdaptationForm = useCallback((obj, i) => {
    setAdaptationForms(forms =>
      forms.map((form, _i) => (i === _i ? Object.assign({ ...form }, obj) : form))
    )
  }, [])

  const addAdaptationForm = useCallback(() => {
    setAdaptationForms(forms => [...forms, {}])
  }, [])

  const removeAdaptationForm = useCallback(i => {
    setAdaptationForms(forms => forms.filter((form, _i) => i !== _i))
  }, [])

  const adaptationFormsValidation = useMemo(
    () => getMultiFormsStatus(adaptationForms.map(form => getFormStatus(adaptationFields, form))),
    [adaptationFields, adaptationForms]
  )

  /* RESEARCH FORMS */

  const updateResearchForm = useCallback((obj, i) => {
    setResearchForms(forms =>
      forms.map((form, _i) => (i === _i ? Object.assign({ ...form }, obj) : form))
    )
  }, [])

  const addResearchForm = useCallback(() => {
    setResearchForms(forms => [...forms, {}])
  }, [])

  const removeResearchForm = useCallback(i => {
    setResearchForms(forms => forms.filter((form, _i) => i !== _i))
  }, [])

  const researchFormsValidation = useMemo(
    () => getMultiFormsStatus(researchForms.map(form => getFormStatus(researchFields, form))),
    [researchFields, researchForms]
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
        projectForm,
        projectFormValidation,
        updateProjectForm,
        mitigationFields,
        mitigationForms,
        mitigationFormsValidation,
        updateMitigationForm,
        addMitigationForm,
        removeMitigationForm,
        adaptationFields,
        updateAdaptationForm,
        addAdaptationForm,
        removeAdaptationForm,
        adaptationForms,
        adaptationFormsValidation,
        researchFields,
        researchForms,
        researchFormsValidation,
        updateResearchForm,
        addResearchForm,
        removeResearchForm,
      }}
    >
      <Fade in={Boolean(data)} key="data-in">
        <span>{children}</span>
      </Fade>
    </context.Provider>
  )
}
