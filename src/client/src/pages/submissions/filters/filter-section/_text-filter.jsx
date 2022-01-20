import { useMemo, memo } from 'react'
import QuickFrom from '../../../../components/quick-form'
import debounce from '../../../../lib/debounce'
import TextField from '@mui/material/TextField'

export default memo(
  ({ field, info: { type, value, label = '', helperText = '' }, setValue }) => {
    const effect = useMemo(() => debounce(({ value }) => setValue(value), 1000), [setValue])

    return (
      <QuickFrom effects={[effect]} value={value}>
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
