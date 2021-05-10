import { DatePicker } from '@material-ui/pickers'

export default ({ helperText, name, placeholder, error, value, onChange, i = 0 }) => (
  <DatePicker
    fullWidth
    margin="normal"
    clearable
    format="MM/dd/yyyy"
    placeholder={placeholder}
    label={name}
    id={`${name}-${i}`}
    helperText={helperText}
    error={error}
    value={value}
    onChange={onChange}
  />
)
