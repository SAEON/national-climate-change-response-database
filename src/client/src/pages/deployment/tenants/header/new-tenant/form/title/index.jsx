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
              placeholder="New deployment"
              helperText="What should the title of the application be?"
              variant="outlined"
              label="Title"
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

  return <Field value={form.title} updateForm={title => setForm({ title })} />
}
