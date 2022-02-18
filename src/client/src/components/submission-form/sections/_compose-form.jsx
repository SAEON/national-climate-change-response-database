import { memo } from 'react'
import { ComposeForm } from '../form'

export default memo(
  ({
    fields,
    validation,
    formLayout,
    RenderField,
    formName,
    hideSections = [],
    defaultExpanded = [],
  }) => (
    <ComposeForm
      formName={formName}
      validation={validation}
      RenderField={RenderField}
      fields={fields}
      hideSections={hideSections}
      defaultExpanded={defaultExpanded}
      sections={Object.fromEntries(formLayout.map(section => Object.entries(section)).flat())}
    />
  ),
  ({ validation: a }, { validation: { b } }) => {
    if (JSON.stringify(a) != JSON.stringify(b)) return false
    return true
  }
)
