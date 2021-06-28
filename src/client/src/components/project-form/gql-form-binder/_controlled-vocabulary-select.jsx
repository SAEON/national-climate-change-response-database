import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import Typography from '@material-ui/core/Typography'
import { gql, useQuery } from '@apollo/client'
import useTheme from '@material-ui/core/styles/useTheme'
import Loading from '../../loading'

const DEFAULT_VALUE = { term: '(NONE)' }

export default ({
  root,
  tree,
  name = '',
  placeholder = '',
  helperText = '',
  error,
  onChange,
  value = DEFAULT_VALUE,
  isRequired = false,
  disabled = false,
  filterChildren = null,
}) => {
  const theme = useTheme()

  const {
    error: gqlError,
    loading,
    data,
  } = useQuery(
    gql`
      query controlledVocabulary($root: String!, $tree: String!) {
        controlledVocabulary(root: $root, tree: $tree) {
          id
          term
          children {
            id
            term
            tree
            root
          }
        }
      }
    `,
    {
      variables: {
        root: root.term || root,
        tree,
      },
    }
  )

  if (loading) {
    return (
      <div
        style={{
          marginTop: theme.spacing(2),
          marginBottom: theme.spacing(2),
          minHeight: theme.spacing(6),
        }}
      >
        <Loading msg={<Typography variant="overline">Loading vocabulary</Typography>} />
      </div>
    )
  }

  if (gqlError) {
    throw gqlError
  }

  let options
  try {
    options = filterChildren
      ? data.controlledVocabulary.children.filter(child => filterChildren(child))
      : data.controlledVocabulary.children
  } catch {
    throw new Error(
      `Unable to retrieve the vocabulary lists for the tree "${tree}" with root "${root}". Please make sure that the database is seeded correctly`
    )
  }

  if (!options.length) {
    return null
  }

  return (
    <TextField
      id={name}
      select
      disabled={disabled}
      label={placeholder}
      placeholder={placeholder}
      helperText={
        <>
          {helperText.split('\\n').map((text, i) => (
            <span key={i}>
              {text}
              <br />
            </span>
          ))}
        </>
      }
      fullWidth
      onChange={e => {
        e.stopPropagation()
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
}
