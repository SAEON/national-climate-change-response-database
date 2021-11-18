import { memo, useContext, useMemo } from 'react'
import { context as formContext } from '../../_context'
import TextField from '@mui/material/TextField'
import Q from '@saeon/quick-form'
import debounce from '../../../../../../../lib/debounce'

const Field = memo(
  ({ value, updateForm }) => {
    const effect = useMemo(
      () => debounce(({ value, valid }) => updateForm(value, valid)),
      [updateForm]
    )

    return (
      <Q effects={[effect]} value={value} valid={false}>
        {(update, { value, valid }) => {
          return (
            <TextField
              margin="normal"
              fullWidth
              required
              error={!valid}
              placeholder="e.g. your.hostname.co.za"
              helperText="What hostname should this tenant be accessed on?"
              variant="outlined"
              label="Hostname"
              value={value}
              onChange={({ target: { value } }) =>
                update({
                  value,
                  valid: Boolean(
                    value.match(
                      /(?=^.{4,253}$)(^((?!-)[a-zA-Z0-9-]{1,63}(?<!-)\.)+[a-zA-Z]{2,63}$)/
                    )
                  ),
                })
              }
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

  return (
    <Field
      value={form.hostname}
      updateForm={(hostname, valid) => setForm({ ...form, hostname, valid })}
    />
  )
}
