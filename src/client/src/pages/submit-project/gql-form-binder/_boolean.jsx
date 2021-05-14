import { memo, useMemo } from 'react'
import TextField from '@material-ui/core/TextField'
import QuickForm from '../../../components/quick-form'
import { MenuItem } from '@material-ui/core'
import debounce from '../../../lib/debounce'

export default memo(
  ({ name, placeholder, helperText, error, value, setValue, i = 0 }) => {
    const effect = useMemo(() => debounce(({ value }) => setValue(value)), [setValue])

    return (
      <QuickForm effect={effect} value={value}>
        {(update, { value }) => {
          return (
            <TextField
              id={`${name}-${i}`}
              select
              placeholder={placeholder}
              helperText={helperText}
              fullWidth
              variant="outlined"
              margin="normal"
              label={name}
              error={error}
              value={value}
              onChange={e => update({ value: e.target.value })}
            >
              <MenuItem key={'false'} value={'false'}>
                No
              </MenuItem>
              <MenuItem key={'true'} value={'true'}>
                Yes
              </MenuItem>
            </TextField>
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
