import { useContext } from 'react'
import { context as filterContext } from '../context'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import ResultCard from './result-card'

export default () => {
  const { records } = useContext(filterContext)
  const theme = useTheme()

  if (!records.length) {
    return (
      <Card variant="outlined" style={{ width: '100%', backgroundColor: theme.backgroundColor }}>
        <CardContent>
          <Typography>No submissions</Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Grid container spacing={2}>
      {records.map(record => {
        const { id, createdBy, project } = record

        return (
          <Grid key={id} item xs={12}>
            <ResultCard id={id} createdBy={createdBy} project={project} />
          </Grid>
        )
      })}
    </Grid>
  )
}
