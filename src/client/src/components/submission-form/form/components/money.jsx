import { useMemo, memo } from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import QuickForm from '../../../quick-form'
import debounce from '../../../../lib/debounce'

export default memo(
  ({ name, placeholder, disabled = false, helperText, error, value, setValue }) => {
    const effect = useMemo(() => debounce(({ value }) => setValue(value), 100), [setValue])

    return (
      <QuickForm effect={effect} value={value}>
        {(update, { value }) => {
          return (
            <TextField
              autoComplete="off"
              id={`${name}`}
              label={name}
              style={{
                overflowX: 'clip',
              }}
              inputProps={{
                style: {
                  appearance: 'textfield',
                  marginRight: -30,
                },
              }}
              disabled={disabled}
              placeholder={placeholder}
              helperText={<span dangerouslySetInnerHTML={{ __html: helperText || '' }}></span>}
              variant="outlined"
              fullWidth
              type="number"
              error={error}
              value={value}
              onChange={e => update({ value: e.target.value })}
              margin="normal"
              InputProps={{
                startAdornment: <InputAdornment position="start">R</InputAdornment>,
              }}
            />
          )
        }}
      </QuickForm>
    )
  },
  /**
   * State is managed internally, and synced
   * to context (otherwise there is a lag when
   * typing).
   *
   * Don't re-render unless unmounted or the error
   * state changes
   */
  ({ error: a }, { error: b }) => {
    return a === b
  }
)
