import { memo, useMemo } from 'react'
import DatePicker from '@mui/lab/DatePicker'
import QuickForm from '../../../quick-form'
import TextField from '@mui/material/TextField'
import debounce from '../../../../lib/debounce'

export default memo(
  ({ helperText, name, placeholder, error, disabled = false, value, setValue }) => {
    const effect = useMemo(() => debounce(({ value }) => setValue(value)), [setValue])

    return (
      <QuickForm effect={effect} value={value}>
        {(update, { value }) => {
          return (
            <DatePicker
              clearable
              disabled={disabled}
              autoOk
              minDate="1990"
              maxDate="2089"
              views={['year']}
              placeholder={placeholder}
              label={name}
              id={`${name}`}
              error={error}
              value={value}
              onChange={value => update({ value })}
              renderInput={params => (
                <TextField
                  helperText={<span dangerouslySetInnerHTML={{ __html: helperText || '' }}></span>}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  {...params}
                />
              )}
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
