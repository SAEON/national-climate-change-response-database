import { useMemo } from 'react'
import TextField from '@material-ui/core/TextField'
import QuickForm from '../../../components/quick-form'
import debounce from '../../../lib/debounce'

export default ({ name, placeholder, helperText, multiline, rows, error, setValue, value }) => {
  const effect = useMemo(() => debounce(({ value }) => setValue(value)), [setValue])

  return (
    <QuickForm effect={effect} value={value}>
      {(update, { value }) => {
        return (
          <TextField
            autoComplete="off"
            onChange={e => update({ value: e.target.value })}
            value={value}
            error={error}
            id={name}
            label={name}
            placeholder={placeholder}
            helperText={helperText}
            multiline={multiline}
            rows={rows}
            fullWidth
            variant="outlined"
            margin="normal"
          />
        )
      }}
    </QuickForm>
  )
}
