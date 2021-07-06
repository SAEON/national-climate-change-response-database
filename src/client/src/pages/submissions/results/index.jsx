import { useContext } from 'react'
import { context as filterContext } from '../context'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import useTheme from '@material-ui/core/styles/useTheme'
import ResultCard from './result-card'

export default () => {
  const { submissions } = useContext(filterContext)
  const theme = useTheme()

  if (!submissions.length) {
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
      {submissions.map(submission => {
        const { id, createdBy, project } = submission

        return (
          <Grid key={id} item xs={12}>
            <ResultCard id={id} createdBy={createdBy} project={project} />
          </Grid>
        )
      })}
    </Grid>
  )
}
