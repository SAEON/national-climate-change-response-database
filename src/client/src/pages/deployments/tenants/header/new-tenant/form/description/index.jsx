import { memo, useContext, useMemo } from 'react'
import { context as formContext } from '../../_context'
import TextField from '@mui/material/TextField'
import Q from '@saeon/quick-form'
import debounce from '../../../../../../../lib/debounce'

const Field = memo(
  ({ value, updateForm }) => {
    const effect = useMemo(() => debounce(({ value }) => updateForm(value)), [updateForm])

    return (
      <Q effects={[effect]} value={value}>
        {(update, { value }) => {
          return (
            <TextField
              margin="normal"
              fullWidth
              multiline
              minRows={2}
              placeholder="New deployment description"
              helperText="The deployment description is shown as a tooltip for the application title"
              variant="outlined"
              label="Description"
              value={value}
              onChange={({ target: { value } }) => update({ value })}
            />
          )
        }}
      </Q>
    )
  },
  () => true
)

export default () => {
  const { form, setForm } = useContext(formContext)

  return <Field value={form.description} updateForm={description => setForm({ description })} />
}
