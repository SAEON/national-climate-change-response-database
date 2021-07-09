import { gql, useQuery } from '@apollo/client'
import useTheme from '@material-ui/core/styles/useTheme'
import Typography from '@material-ui/core/Typography'
import Loading from '../../../loading'
import Multiselect from '../../../multiselect'

export default ({ roots, tree, disabled = false, value, onChange, helperText, label, id }) => {
  const theme = useTheme()

  const { error, loading, data } = useQuery(
    gql`
      query controlledVocabularies($roots: [String!], $tree: String!) {
        controlledVocabulary(roots: $roots, tree: $tree) {
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
        roots: roots.map(root => root?.term || root),
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

  if (error) {
    throw error
  }

  let options
  try {
    options = data.controlledVocabulary.map(({ children }) => children).flat()
  } catch {
    throw new Error(
      'Unable to retrieve the vocabulary lists - please make sure that the database is seeded correctly'
    )
  }

  return (
    <Multiselect
      id={id}
      disabled={disabled}
      options={options.map(({ term }) => term)}
      value={value || []}
      helperText={<span dangerouslySetInnerHTML={{ __html: helperText || '' }}></span>}
      label={label}
      setValue={onChange} // TODO - should store vocabulary object. not jus value
    />
  )
}
