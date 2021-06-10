import Grid from '@material-ui/core/Grid'
import Card from './_card'

export default ({ project, mitigations, adaptations, projectSections }) => {
  return (
    <Grid container spacing={2}>
      {Object.entries(projectSections).map(([title, fieldNames]) => {
        return (
          <Grid item xs={12} md={6} key={title}>
            <Card
              title={title}
              json={Object.fromEntries(
                Object.entries(project).filter(([field]) => fieldNames.includes(field))
              )}
            />
          </Grid>
        )
      })}
    </Grid>
  )
}
