import { useMemo, memo } from 'react'
import { gql, useQuery } from '@apollo/client'
import QuickFrom from '../../../../components/quick-form'
import debounce from '../../../../lib/debounce'
import TextField from '@material-ui/core/TextField'
import Loading from '../../../../components/loading'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'

export const DEFAULT_VALUE = '(NONE)'

const Component = memo(
  ({ field, info: { type, value, label = '', helperText = '' }, setValue, options }) => {
    const effect = useMemo(() => debounce(({ value }) => setValue(value)), [setValue])

    return (
      <QuickFrom effect={effect} value={value}>
        {(update, { value }) => {
          return (
            <TextField
              id={`filter-${field}-${type}`}
              fullWidth
              select
              autoComplete="off"
              variant="outlined"
              margin="normal"
              label={label}
              helperText={helperText}
              value={value || DEFAULT_VALUE}
              onChange={({ target: { value } }) => {
                if (value === DEFAULT_VALUE) {
                  update({ value: undefined })
                } else {
                  update({ value })
                }
              }}
            >
              {[DEFAULT_VALUE, ...options].map(term => {
                return (
                  <MenuItem key={term} value={term}>
                    <Typography variant="overline">{term}</Typography>
                  </MenuItem>
                )
              })}
            </TextField>
          )
        }}
      </QuickFrom>
    )
  },
  () => true
)

export default ({ tree, root, ...props }) => {
  const { error, loading, data } = useQuery(
    gql`
      query controlledVocabulary($root: String, $tree: String!) {
        controlledVocabulary(tree: $tree, root: $root) {
          id
          children {
            id
            term
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
    return <Loading />
  }

  if (error) {
    throw error
  }

  const options = data.controlledVocabulary
    .map(({ children }) => children.map(({ term }) => term))
    .flat()

  return <Component options={options} {...props} />
}
