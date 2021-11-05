import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'
import { gql, useQuery } from '@apollo/client'
import { useTheme } from '@mui/material/styles'
import Loading from '../../../loading'

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
      query controlledVocabulary($root: String, $tree: String!) {
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
        root: root?.term || root,
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
    throw new Error(`GQL Error in Vocabulary select form component. ${gqlError.message}`)
  }

  /**
   * Since this component takes a single value as root,
   * only a single term is returned (with multiple children)
   */
  const controlledVocabulary = data.controlledVocabulary[0]

  let options
  try {
    options = filterChildren
      ? controlledVocabulary.children.filter(child => filterChildren(child))
      : controlledVocabulary.children
  } catch (error) {
    /**
     * The old data from the ERM database sometimes
     * doesn't have the same terms. So usually if this
     * error occurs it's because an old submission is
     * being edited and the vocabulary misaligns
     */
    if (root?.term) {
      options = []
    } else {
      throw new Error(
        `Unable to retrieve the vocabulary lists for the tree "${tree}" with root "${JSON.stringify(
          root,
          null,
          2
        )}". Please make sure that the database is seeded correctly\n\n${error.message}`
      )
    }
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
      helperText={<span dangerouslySetInnerHTML={{ __html: helperText || '' }}></span>}
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
