import { gql, useQuery } from '@apollo/client'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Loading from '../../../loading'
import Multiselect from '../../../multiselect'

export default ({
  roots,
  tree,
  disabled = false,
  value,
  onChange,
  helperText,
  label,
  id,
  error,
}) => {
  const theme = useTheme()

  const {
    error: gqlError,
    loading,
    data,
  } = useQuery(
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

  if (gqlError) {
    throw new Error(
      `GQL Error in Vocabulary select (multiple roots) form component. ${gqlError.message}`
    )
  }

  let options
  try {
    options = data.controlledVocabulary.map(({ children }) => children).flat()
  } catch {
    /**
     * The old data from the ERM database sometimes
     * doesn't have the same terms. So usually if this
     * error occurs it's because an old submission is
     * being edited and the vocabulary misaligns
     */
    if (roots?.length && roots?.[0]?.term) {
      options = []
    } else {
      throw new Error(
        `Unable to retrieve the vocabulary lists for the tree "${tree}" with root "${JSON.stringify(
          roots,
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
    <Multiselect
      id={id}
      disabled={disabled}
      error={error}
      options={options.map(({ term }) => term)}
      value={value?.map(({ term }) => term) || []}
      helperText={<span dangerouslySetInnerHTML={{ __html: helperText || '' }}></span>}
      label={label}
      setValue={values => {
        const newValues = options.filter(({ term }) => values.includes(term))
        onChange(newValues)
      }}
    />
  )
}
