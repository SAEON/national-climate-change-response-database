import { useMemo, memo } from 'react'
import QuickFrom from '../../../../components/quick-form'
import debounce from '../../../../lib/debounce'
import TextField from '@material-ui/core/TextField'

export default memo(
  ({ field, info: { type, value, label = '', helperText = '' }, setValue }) => {
    const effect = useMemo(() => debounce(({ value }) => setValue(value), 500), [setValue])

    return (
      <QuickFrom effect={effect} value={value}>
        {(update, { value }) => {
          return (
            <TextField
              id={`filter-${field}-${type}`}
              fullWidth
              autoComplete="off"
              variant="outlined"
              margin="normal"
              label={label}
              helperText={helperText}
              value={value}
              onChange={({ target: { value } }) => update({ value })}
            />
          )
        }}
      </QuickFrom>
    )
  },
  () => true
)
