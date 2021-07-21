import Grid from '@material-ui/core/Grid'
import Card from './_card'
import { parse } from 'wkt'

export default ({
  submission,
  project,
  mitigation,
  adaptation,
  projectSections,
  adaptationSections,
  mitigationSections,
  submissionSections,
}) => {
  return (
    <Grid container spacing={2}>
      {/* SUBMISSION */}
      {Object.entries(submissionSections).map(([title, fieldNames]) => {
        return (
          <Grid item xs={12} key={title}>
            <Card
              title={title}
              json={Object.fromEntries(
                Object.entries(submission).filter(([field]) => fieldNames.includes(field))
              )}
            />
          </Grid>
        )
      })}

      {/* PROJECT */}
      {Object.entries(projectSections).map(([title, fieldNames]) => {
        return (
          <Grid item xs={12} key={title}>
            <Card
              title={title}
              json={Object.fromEntries(
                Object.entries(project)
                  .filter(([field]) => fieldNames.includes(field))
                  .map(([field, value]) => {
                    if (
                      field === 'province' ||
                      field === 'districtMunicipality' ||
                      field === 'localMunicipality'
                    ) {
                      return [field, value.map(({ term }) => term).join(', ')]
                    }

                    if (field === 'yx') {
                      return [
                        'coordinates',
                        parse(value)
                          .geometries.map(({ coordinates: [y, x] }) => `(${x} ${y})`)
                          .join(', '),
                      ]
                    }
                    return [field, value]
                  })
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
