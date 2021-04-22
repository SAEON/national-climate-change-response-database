import TextField from '@material-ui/core/TextField'
import { MenuItem } from '@material-ui/core'
import { DatePicker } from '@material-ui/pickers'
import InputAdornment from '@material-ui/core/InputAdornment'

export const StringField = ({
  name,
  placeholder,
  helperText,
  multiline,
  rows,
  error,
  onChange,
  value,
}) => (
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

export const DateTimeField = ({ helperText, name, placeholder, error, value, onChange }) => (
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

export const IntField = () => 'I am an int field'

export const MoneyField = ({ name, placeholder, helperText, error, value, onChange }) => (
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

export const BooleanField = ({ name, placeholder, helperText, error, value, onChange }) => (
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
    <MenuItem key={'false'} value={'false'}>
      Not Validated
    </MenuItem>
    <MenuItem key={'true'} value={'true'}>
      Validated
    </MenuItem>
  </TextField>
)
