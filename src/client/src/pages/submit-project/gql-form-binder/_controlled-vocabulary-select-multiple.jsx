import { gql, useQuery } from '@apollo/client'
import Fade from '@material-ui/core/Fade'
import useTheme from '@material-ui/core/styles/useTheme'
import Loading from '../../../components/loading'
import Typography from '@material-ui/core/Typography'
import Multiselect from '../../../components/multiselect'

export default ({ root, tree, disabled = false, value, setValue, helperText, label, id }) => {
  const theme = useTheme()

  const { error, loading, data } = useQuery(
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
        root,
        tree,
      },
    }
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
          <Loading msg={<Typography variant="overline">Loading vocabulary</Typography>} />
        </div>
      </Fade>
    )
  }

  if (error) {
    throw error
  }

  let options
  try {
    options = data.controlledVocabulary.children
  } catch {
    throw new Error(
      'Unable to retrieve the vocabulary lists - please make sure that the database is seeded correctly'
    )
  }

  return (
    <Fade in={Boolean(data)} key="data-in">
      <div>
        <Multiselect
          id={id}
          disabled={disabled}
          options={options.map(({ term }) => term)}
          value={value}
          helperText={helperText}
          label={label}
          setValue={setValue}
        />
      </div>
    </Fade>
  )
}
