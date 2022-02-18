import { useContext } from 'react'
import { context as formContext } from '../../context'
import RenderField from './_render-field'
import ComposeForm from '../_compose-form'

export default ({ active }) => {
  const { formLayout, projectFields, generalDetailsFormValidation } = useContext(formContext)

  if (!active) {
    return null
  }

  return (
    <ComposeForm
      formName="project"
      RenderField={RenderField}
      validation={generalDetailsFormValidation}
      fields={projectFields}
      formLayout={formLayout.generalDetails}
      defaultExpanded={['Project overview']}
    />
  )
}
