import { useContext } from 'react'
import { context as formContext } from '../../context'
import RenderField from './_render-field'
import ComposeForm from '../_compose-form'

export default ({ active }) => {
  const { formLayout, mitigationFields, mitigationFormsValidation } = useContext(formContext)

  if (!active) {
    return null
  }

  return (
    <ComposeForm
      formName="mitigation"
      RenderField={RenderField}
      validation={mitigationFormsValidation}
      fields={mitigationFields}
      formLayout={formLayout.mitigationDetails}
      defaultExpanded={['Host sector']}
    />
  )
}
