import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'

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
    {options.map(({ name, description }) => {
      const [placeholder] = description?.split('::').map(s => s.trim()) || []
      return (
        <MenuItem key={name} value={name}>
          <Typography variant="overline">{placeholder}</Typography>
        </MenuItem>
      )
    })}
  </TextField>
)
