import { useCallback, memo } from 'react'
import TextField from '@mui/material/TextField'
import QuickForm from '../../../quick-form'
import debounce from '../../../../lib/debounce'

export default memo(
  ({
    name,
    placeholder,
    disabled = false,
    helperText,
    multiline,
    rows,
    error,
    setValue,
    value,
  }) => {
    return (
      <QuickForm
        effects={[
          useCallback(
            () =>
              debounce(({ value: newValue }) => {
                setValue(newValue)
              }, 250),
            [setValue]
          ),
        ]}
        value={value}
      >
        {(update, { value }) => {
          return (
            <TextField
              autoComplete="off"
              onChange={e => update({ value: e.target.value })}
              value={value}
              disabled={disabled}
              error={error}
              id={`${name}`}
              label={name}
              placeholder={placeholder}
              helperText={<span dangerouslySetInnerHTML={{ __html: helperText || '' }}></span>}
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
  },
  /**
   * State is managed internally, and synced
   * to context (otherwise there is a lag when
   * typing).
   *
   * Don't re-render unless unmounted or the error
   * state changes
   */
  (a, b) => {
    const { error: aE, value: aV } = a
    const { error: bE, value: bV } = b

    if (aE !== bE) return false
    if (aV !== bV) return false

    return true
  }
)
