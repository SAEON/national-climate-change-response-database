import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { useQuery, gql } from '@apollo/client'
import Loading from '../../../components/loading'
import Fade from '@material-ui/core/Fade'
import useTheme from '@material-ui/core/styles/useTheme'

export default () => {
  const theme = useTheme()

  const { error, loading, data } = useQuery(gql`
    query projects {
      projects {
        id
      }
    }
  `)

  if (loading) {
    return (
      <Fade in={loading} key="loading-in">
        <div>
          <Loading />
        </div>
      </Fade>
    )
  }

  if (error) {
    throw error
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card variant="outlined" style={{ width: '100%' }}>
          Filters will go here
        </Card>
      </Grid>
      {data.projects.map(({ id }) => (
        <Grid key={id} item xs={12}>
          <Card
            variant="outlined"
            style={{ width: '100%', backgroundColor: theme.backgroundColor }}
          >
            <CardHeader title={id} />
            <CardContent>
              <Typography>Project details here</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}
