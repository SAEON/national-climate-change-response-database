import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import Chip from '@material-ui/core/Chip'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import Box from '@material-ui/core/Box'
import MenuItem from '@material-ui/core/MenuItem'
import Checkbox from '@material-ui/core/Checkbox'
import FormHelperText from '@material-ui/core/FormHelperText'
import ListItemText from '@material-ui/core/ListItemText'
import useTheme from '@material-ui/core/styles/useTheme'
import Loading from '../../components/loading'
import clsx from 'clsx'
import makeStyles from '@material-ui/core/styles/makeStyles'

const useStyles = makeStyles(theme => ({
  select: {
    '& .MuiSelect-icon': {
      marginRight: theme.spacing(1),
    },
  },
}))

export default ({
  id,
  options,
  value,
  setValue,
  label,
  error = false,
  helperText = '',
  chipProps = {},
  disabled = false,
  loading = false,
}) => {
  const classes = useStyles()
  const theme = useTheme()

  return (
    <div style={{ marginTop: theme.spacing(2), marginBottom: theme.spacing(1), maxWidth: '100%' }}>
      <FormControl margin="normal" fullWidth>
        <InputLabel
          error={error}
          id={`${id}-label`}
          style={{ top: value.length ? -8 : -5, left: 12 }}
        >
          {label}
        </InputLabel>
        <Select
          className={clsx(classes.select)}
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
              style={{
                display: 'inline-flex',
                gap: theme.spacing(1),
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
            <MenuItem key={option} value={option}>
              <Checkbox checked={value.indexOf(option) > -1} />
              <ListItemText primary={option} style={{ overflowX: 'auto' }} />
            </MenuItem>
          ))}
          {loading ? <Loading /> : null}
        </Select>
        <FormHelperText style={{ marginLeft: 14 }}>{helperText}</FormHelperText>
      </FormControl>
    </div>
  )
}
