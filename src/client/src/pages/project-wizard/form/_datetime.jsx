import { DatePicker } from '@material-ui/pickers'

export default ({ helperText, name, placeholder, error, value, onChange }) => (
  <DatePicker
    fullWidth
    margin="normal"
    clearable
    format="MM/dd/yyyy"
    placeholder={placeholder}
    label={name}
    helperText={helperText}
    error={error}
    value={value}
    onChange={onChange}
  />
)
