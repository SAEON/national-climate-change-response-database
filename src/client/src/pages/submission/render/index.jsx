import Grid from '@material-ui/core/Grid'
import Card from './_card'

export default ({
  project,
  mitigation,
  adaptation,
  projectSections,
  adaptationSections,
  mitigationSections,
}) => {
  return (
    <Grid container spacing={2}>
      {/* PROJECT */}
      {Object.entries(projectSections).map(([title, fieldNames]) => {
        return (
          <Grid item xs={12} key={title}>
            <Card
              title={title}
              json={Object.fromEntries(
                Object.entries(project).filter(([field]) => fieldNames.includes(field))
              )}
            />
          </Grid>
        )
      })}

      {/* MITIGATION */}
      {Object.keys(mitigation).length &&
        Object.entries(mitigationSections).map(([title, fieldNames]) => {
          return (
            <Grid item xs={12} key={title}>
              <Card
                title={title}
                json={Object.fromEntries(
                  Object.entries(mitigation).filter(([field]) => fieldNames.includes(field))
                )}
              />
            </Grid>
          )
        })}

      {/* ADAPTATION */}
      {Object.keys(adaptation).length &&
        Object.entries(adaptationSections).map(([title, fieldNames]) => {
          return (
            <Grid item xs={12} key={title}>
              <Card
                title={title}
                json={Object.fromEntries(
                  Object.entries(adaptation).filter(([field]) => fieldNames.includes(field))
                )}
              />
            </Grid>
          )
        })}
    </Grid>
  )
}
