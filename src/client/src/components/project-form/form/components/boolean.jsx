import { memo, useMemo } from 'react'
import TextField from '@mui/material/TextField'
import { MenuItem } from '@mui/material'
import QuickForm from '../../../quick-form'
import debounce from '../../../../lib/debounce'

export default memo(
  ({ name, placeholder, disabled = false, helperText, error, value, setValue }) => {
    const effect = useMemo(() => debounce(({ value }) => setValue(value)), [setValue])

    return (
      <QuickForm effect={effect} value={value}>
        {(update, { value }) => {
          return (
            <TextField
              id={`${name}`}
              select
              placeholder={placeholder}
              helperText={<span dangerouslySetInnerHTML={{ __html: helperText || '' }}></span>}
              fullWidth
              disabled={disabled}
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
