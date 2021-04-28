import TextField from '@material-ui/core/TextField'

export default ({ name, placeholder, helperText, multiline, rows, error, onChange, value }) => (
  <TextField
    autoComplete="off"
    onChange={onChange}
    value={value}
    error={error}
    id={name}
    label={name}
    placeholder={placeholder}
    helperText={helperText}
    multiline={multiline}
    rows={rows}
    fullWidth
    variant="outlined"
    margin="normal"
  />
)
