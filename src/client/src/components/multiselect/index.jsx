import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import Chip from '@mui/material/Chip'
import OutlinedInput from '@mui/material/OutlinedInput'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import FormHelperText from '@mui/material/FormHelperText'
import ListItemText from '@mui/material/ListItemText'
import Loading from '../../components/loading'
import { Div } from '../../components/html-tags'

export default ({
  id,
  options,
  value,
  setValue,
  label,
  error = false,
  helperText = '',
  chipProps = {},
  isOptionDisabled = () => false,
  disabled = false,
  loading = false,
}) => {
  return (
    <Div
      sx={theme => ({
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(1),
        maxWidth: '100%',
      })}
    >
      <FormControl margin="normal" fullWidth>
        <InputLabel error={error} id={`${id}-label`}>
          {label}
        </InputLabel>
        <Select
          sx={{
            '& .MuiSelect-icon': {
              marginRight: theme => theme.spacing(1),
            },
          }}
          disabled={disabled}
          fullWidth
          error={error}
          labelId={`${id}-label`}
          id={`${id}-multi-select`}
          multiple
          value={value}
          MenuProps={{
            MenuListProps: {
              style: {
                padding: 0,
              },
            },
            PaperProps: {
              style: {},
            },
          }}
          onChange={e => {
            e.stopPropagation()
            const { value } = e.target
            setValue(value)
          }}
          input={<OutlinedInput id={`${id}-input-label`} label={label} />}
          renderValue={selected => (
            <Box
              sx={{
                display: 'inline-flex',
                gap: theme => theme.spacing(1),
                flexWrap: 'wrap',
                alignItems: 'flex-start',
                maxWidth: '100%',
              }}
            >
              {selected.map(value => {
                const { style, color = undefined, ...props } = chipProps
                const _color = typeof color === 'function' ? color(value) : color || 'primary'
                return (
                  <Chip
                    size="small"
                    color={_color}
                    key={value}
                    label={value}
                    style={{
                      maxWidth: '100%',
                      ...style,
                    }}
                    {...props}
                  />
                )
              })}
            </Box>
          )}
        >
          {options.map(option => (
            <MenuItem disabled={isOptionDisabled(option)} key={option} value={option}>
              <Checkbox checked={value.indexOf(option) > -1} />
              <ListItemText primary={option} style={{ overflowX: 'auto' }} />
            </MenuItem>
          ))}
          {loading ? <Loading /> : null}
        </Select>
        <FormHelperText style={{ marginLeft: 14 }}>{helperText}</FormHelperText>
      </FormControl>
    </Div>
  )
}
