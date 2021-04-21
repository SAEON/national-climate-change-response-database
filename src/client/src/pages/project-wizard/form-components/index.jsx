import TextField from '@material-ui/core/TextField'
import { MenuItem } from '@material-ui/core'
import { KeyboardDatePicker } from '@material-ui/pickers'
import InputAdornment from '@material-ui/core/InputAdornment'

export const StringField = ({ name, placeholder, helperText, multiline, rows }) => (
  <TextField
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

export const DateTimeField = ({ helperText, name }) => (
  <div>
    <KeyboardDatePicker
      fullWidth
      margin="normal"
      clearable
      format="MM/dd/yyyy"
      placeholder="10/10/2018"
      label={name}
      helperText={helperText}
    />
  </div>
)

export const IntField = () => 'I am an int field'

export const MoneyField = ({ name, placeholder, helperText }) => (
  <TextField
    id={name}
    label={name}
    placeholder={placeholder}
    helperText={helperText}
    variant="outlined"
    fullWidth
    margin="normal"
    InputProps={{
      startAdornment: <InputAdornment position="start">R</InputAdornment>,
    }}
  />
)

export const BooleanField = ({ name, placeholder, helperText }) => (
  <TextField
    id={name}
    select
    placeholder={placeholder}
    helperText={helperText}
    fullWidth
    variant="outlined"
    margin="normal"
    label={name}
  >
    <MenuItem key={'Yes'} value={true}>
      Validated
    </MenuItem>
    <MenuItem key={'No'} value={false}>
      Not Validated
    </MenuItem>
  </TextField>
)
