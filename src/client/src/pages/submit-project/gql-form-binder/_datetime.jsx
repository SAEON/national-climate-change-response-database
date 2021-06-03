import { memo, useMemo } from 'react'
import { DatePicker } from '@material-ui/pickers'
import QuickForm from '../../../components/quick-form'
import debounce from '../../../lib/debounce'

export default memo(
  ({ helperText, name, placeholder, error, value, setValue, i = 0 }) => {
    const effect = useMemo(() => debounce(({ value }) => setValue(value)), [setValue])

    return (
      <QuickForm effect={effect} value={value}>
        {(update, { value }) => {
          return (
            <DatePicker
              fullWidth
              margin="normal"
              inputVariant="outlined"
              clearable
              autoOk
              minDate="1990"
              maxDate="2089"
              format="yyyy"
              views={['year']}
              placeholder={placeholder}
              label={name}
              id={`${name}-${i}`}
              helperText={helperText}
              error={error}
              value={value}
              onChange={value => update({ value })}
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
