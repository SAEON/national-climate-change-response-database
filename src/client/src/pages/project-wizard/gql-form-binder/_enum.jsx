import TextField from '@material-ui/core/TextField'
import { MenuItem } from '@material-ui/core'

export default ({ name, placeholder, helperText, error, value, onChange, options }) => (
  <TextField
    id={name}
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
    {options.map(item => {
      return (
        <MenuItem key={item} value={item}>
          {item}
        </MenuItem>
      )
    })}
  </TextField>
)
