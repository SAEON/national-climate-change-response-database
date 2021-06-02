import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import WithControlledVocabulary from './_with-controlled-vocabulary'

const DEFAULT_VALUE = { term: '(NONE)' }

export default ({
  root,
  tree,
  name,
  placeholder,
  helperText,
  error,
  onChange,
  value = DEFAULT_VALUE,
  isRequired = false,
}) => {
  return (
    <WithControlledVocabulary root={root.term || root} tree={tree}>
      {({ options }) => {
        if (!options.length) {
          return null
        }

        return (
          <TextField
            id={name}
            select
            label={placeholder}
            placeholder={placeholder}
            helperText={helperText}
            fullWidth
            onChange={e => {
              const { value } = e.target
              if (value === DEFAULT_VALUE.term) {
                onChange(undefined)
              } else {
                onChange(options.find(({ term }) => term === value))
              }
            }}
            variant="outlined"
            margin="normal"
            value={value.term}
            error={isRequired ? value === DEFAULT_VALUE.term || error : error}
          >
            {[DEFAULT_VALUE, ...options].map(({ term }) => {
              return (
                <MenuItem key={term} value={term}>
                  <Typography variant="overline">{term}</Typography>
                </MenuItem>
              )
            })}
          </TextField>
        )
      }}
    </WithControlledVocabulary>
  )
}
