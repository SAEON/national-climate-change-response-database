import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'

export default ({ name, placeholder, helperText, error, value, onChange }) => (
  <TextField
    autoComplete="off"
    id={name}
    label={name}
    placeholder={placeholder}
    helperText={helperText}
    variant="outlined"
    fullWidth
    type="number"
    error={error}
    value={value}
    onChange={onChange}
    margin="normal"
    InputProps={{
      startAdornment: <InputAdornment position="start">R</InputAdornment>,
    }}
  />
)
