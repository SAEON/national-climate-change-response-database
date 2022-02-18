import { useContext } from 'react'
import { context as formContext } from '../../context'
import RenderField from './_render-field'
import ComposeForm from '../_compose-form'

export default ({ active }) => {
  const { adaptationFields, adaptationFormsValidation, formLayout } = useContext(formContext)

  if (!active) {
    return null
  }

  return (
    <ComposeForm
      formName="adaptation"
      RenderField={RenderField}
      validation={adaptationFormsValidation}
      fields={adaptationFields}
      formLayout={formLayout.adaptationDetails}
      defaultExpanded={['Adaptation details']}
    />
  )
}
