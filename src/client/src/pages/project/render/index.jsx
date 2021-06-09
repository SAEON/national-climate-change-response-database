import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import useTheme from '@material-ui/core/styles/useTheme'

const C = ({ json }) => {
  const theme = useTheme()

  return (
    <Card style={{ backgroundColor: theme.backgroundColor }} variant="outlined">
      <CardContent>
        <pre>{JSON.stringify(json, null, 2)}</pre>
      </CardContent>
    </Card>
  )
}

export default ({ project, mitigations, adaptations, projectSections }) => {
  return (
    <Grid container spacing={2}>
      {Object.entries(projectSections).map(([title, fieldNames]) => {
        return (
          <C
            key={title}
            json={Object.fromEntries(
              Object.entries(project).filter(([field]) => fieldNames.includes(field))
            )}
          />
        )
      })}
    </Grid>
  )
}
