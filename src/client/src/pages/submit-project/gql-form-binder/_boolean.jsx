import TextField from '@material-ui/core/TextField'
import { MenuItem } from '@material-ui/core'

export default ({ name, placeholder, helperText, error, value, onChange, i = 0 }) => (
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
    onChange={onChange}
  >
    <MenuItem key={'false'} value={'false'}>
      Not Validated
    </MenuItem>
    <MenuItem key={'true'} value={'true'}>
      Validated
    </MenuItem>
  </TextField>
)
