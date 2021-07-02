import { useContext, memo, useMemo } from 'react'
import { context as formContext } from './../_context'
import QuickForm from '../../../quick-form'
import debounce from '../../../../lib/debounce'
import Render from './_render'

const Compose = memo(
  ({ submissionId, updateValue, placeholder, helperText, value = [], formName }) => {
    const effect = useMemo(() => debounce(({ value }) => updateValue(value)), [updateValue])

    return (
      <QuickForm effect={effect} value={value}>
        {(update, { value }) => (
          <Render
            formName={formName}
            submissionId={submissionId}
            placeholder={placeholder}
            helperText={helperText}
            value={value}
            updateValue={value => update({ value })}
          />
        )}
      </QuickForm>
    )
  },
  /**
   * State is managed internally, and synced
   * to context.
   *
   * Never re-render this component once mounted
   */
  () => true
)

/**
 * Files are uploaded, and responses from the server
 * are added to the main form state
 */
export default ({ formName, updateValue, placeholder, helperText, value }) => {
  const { submissionId } = useContext(formContext)

  return (
    <Compose
      formName={formName}
      updateValue={updateValue}
      placeholder={placeholder}
      helperText={helperText}
      value={value}
      submissionId={submissionId}
    />
  )
}
