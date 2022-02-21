import { useState, useEffect } from 'react'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { gql, useMutation, useQuery, useLazyQuery } from '@apollo/client'
import Loading from '../../../../../components/loading'
import { Pre, Code } from '../../../../../components/html-tags'

export default ({ field, incorrectTerm, tree, setOpen }) => {
  const [sql, setSql] = useState({ sql: 'Select new term...' })
  const [newTerm, setNewTerm] = useState('')
  const {
    error: queryError,
    loading: queryLoading,
    data: queryData,
  } = useQuery(
    gql`
      query ($treeName: String!) {
        flattenedTree(treeName: $treeName)
      }
    `,
    {
      variables: {
        treeName: tree,
      },
    }
  )

  const [fixVocabularySql, { error: getSqlError, loading: getSqlLoading, data: sqlData }] =
    useLazyQuery(
      gql`
        query ($term: String!, $field: String!, $incorrectTerm: String!) {
          fixVocabularySql(term: $term, field: $field, incorrectTerm: $incorrectTerm)
        }
      `
    )

  const [fixVocabulary, { error: mutationError, loading: mutationLoading }] = useMutation(
    gql`
      mutation ($term: String!, $field: String!, $incorrectTerm: String!) {
        fixVocabulary(term: $term, field: $field, incorrectTerm: $incorrectTerm)
      }
    `,
    {
      onCompleted: () => {
        setOpen(false)
        window.location.reload(false)
      },
    }
  )

  useEffect(() => {
    if (newTerm) {
      fixVocabularySql({
        variables: {
          field,
          incorrectTerm,
          term: newTerm,
        },
      })
    }
  }, [field, fixVocabularySql, incorrectTerm, newTerm])

  useEffect(() => {
    if (sqlData) {
      setSql(sqlData.fixVocabularySql)
    }
  }, [sqlData])

  if (queryLoading) {
    return <Loading />
  }

  if (queryError) {
    throw queryError
  }

  if (getSqlError) {
    throw getSqlError
  }

  if (mutationError) {
    throw mutationError
  }

  return (
    <>
      <DialogTitle title="Fix incorrect vocabulary">Fix incorrect vocabulary</DialogTitle>
      <DialogContent dividers>
        <Typography sx={{ my: theme => theme.spacing(2) }} gutterBottom variant="body2">
          Field: {field}
        </Typography>
        <Typography sx={{ my: theme => theme.spacing(2) }} gutterBottom variant="body2">
          Incorrect term: {incorrectTerm}
        </Typography>
        <Typography sx={{ my: theme => theme.spacing(2) }} gutterBottom variant="body2">
          Tree: {tree}
        </Typography>
        <FormControl sx={{ mt: theme => theme.spacing(1) }} fullWidth>
          <InputLabel id="select-new-term">Corrected vocabulary term</InputLabel>
          <Select
            fullWidth
            labelId="select-new-term"
            id="select-new-term-select"
            value={newTerm}
            label="Corrected vocabulary term"
            onChange={e => setNewTerm(e.target.value)}
          >
            {queryData.flattenedTree.map(term => (
              <MenuItem key={term} value={term}>
                {term}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>Select a term from the list</FormHelperText>
        </FormControl>
        <Typography sx={{ mt: theme => theme.spacing(2) }} gutterBottom variant="body2">
          This will change all matching vocabularies for this particular field to another vocabulary
          term. The SQL is dependent on whether the field is a multi-select or single-single select
          vocabulary term
        </Typography>
        <Pre>
          <Code sx={{ whiteSpace: 'normal', fontSize: '0.7rem', display: 'block' }}>
            {getSqlLoading ? 'Loading ...' : sql.query}
          </Code>
          {sql?.params && (
            <Code
              sx={{
                whiteSpace: 'normal',
                mt: theme => theme.spacing(2),
                fontSize: '0.7rem',
                display: 'block',
              }}
            >
              {JSON.stringify(sql.params, null, 2)}
            </Code>
          )}
        </Pre>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={getSqlLoading || mutationLoading}
          siz="small"
          variant="text"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
        <Button
          disabled={getSqlLoading || !sql.params || mutationLoading}
          siz="small"
          variant="text"
          onClick={() => {
            fixVocabulary({
              variables: {
                term: newTerm,
                field,
                incorrectTerm,
              },
            })
          }}
        >
          {mutationLoading ? 'Working ...' : 'Okay'}
        </Button>
      </DialogActions>
    </>
  )
}
