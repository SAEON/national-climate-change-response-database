import { gql, useQuery } from '@apollo/client'
import TextField from '@material-ui/core/TextField'
import Loading from '../../../components/loading'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import useTheme from '@material-ui/core/styles/useTheme'
import Fade from '@material-ui/core/Fade'

const DEFAULT_VALUE = '(NONE)'

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
  const theme = useTheme()

  const { error: gqlError, loading, data } = useQuery(
    gql`
      query controlledVocabulary($root: String!, $tree: String!) {
        controlledVocabulary(root: $root, tree: $tree) {
          id
          term
          children {
            id
            term
          }
        }
      }
    `,
    { variables: { root, tree } }
  )

  if (loading) {
    return (
      <Fade in={loading} key="loading-in">
        <div
          style={{
            marginTop: theme.spacing(2),
            marginBottom: theme.spacing(2),
            minHeight: theme.spacing(6),
          }}
        >
          <Loading msg={<Typography variant="overline">{`Loading ${tree} tree`}</Typography>} />
        </div>
      </Fade>
    )
  }

  if (gqlError) {
    throw gqlError
  }

  const { children: options } = data.controlledVocabulary

  if (!options.length) {
    return null
  }

  return (
    <Fade in={Boolean(data)} key="data-in">
      <TextField
        id={name}
        select
        label={placeholder}
        placeholder={placeholder}
        helperText={helperText}
        fullWidth
        onChange={e => {
          const { value } = e.target
          if (value === DEFAULT_VALUE) {
            onChange(undefined)
          } else {
            onChange(value)
          }
        }}
        variant="outlined"
        margin="normal"
        value={value}
        error={isRequired ? value === DEFAULT_VALUE || error : error}
      >
        {[{ term: '(NONE)' }, ...options].map(({ term }) => {
          return (
            <MenuItem key={term} value={term}>
              <Typography variant="overline">{term}</Typography>
            </MenuItem>
          )
        })}
      </TextField>
    </Fade>
  )
}
