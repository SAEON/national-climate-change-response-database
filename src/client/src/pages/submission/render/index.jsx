import Grid from '@mui/material/Grid'
import Card from './card'
import { parse } from 'wkt'
import fixGridValues from '../../../components/submission-form/form/components/calculators/fix-grid-values'

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
                    if (field === 'xy') {
                      return [
                        'coordinates (lng/lat)',
                        parse(value).geometries.map(({ coordinates: [x, y] }) => `(${x} ${y})`),
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
      {Object.keys(mitigation).filter(key => key !== 'fileUploads').length
        ? Object.entries(mitigationSections).map(([title, fieldNames]) => {
            return (
              <Grid item xs={12} key={title}>
                <Card
                  title={title}
                  json={Object.fromEntries(
                    Object.entries(mitigation)
                      .filter(([field]) => fieldNames.includes(field))
                      .map(([field, value]) => {
                        if (field === 'progressData') {
                          return [
                            field,
                            fixGridValues({ calculatorType: 'progress', calculator: value }),
                          ]
                        }
                        return [field, value]
                      })
                  )}
                />
              </Grid>
            )
          })
        : null}

      {/* ADAPTATION */}
      {Object.keys(adaptation).filter(key => key !== 'fileUploads').length
        ? Object.entries(adaptationSections).map(([title, fieldNames]) => {
            return (
              <Grid item xs={12} key={title}>
                <Card
                  title={title}
                  json={Object.fromEntries(
                    Object.entries(adaptation)
                      .filter(([field]) => fieldNames.includes(field))
                      .map(([field, value]) => {
                        if (field === 'progressData') {
                          const { grid2 } = fixGridValues({
                            calculatorType: 'progress',
                            calculator: value,
                          })
                          return [field, { grid2 }]
                        }
                        return [field, value]
                      })
                  )}
                />
              </Grid>
            )
          })
        : null}
    </Grid>
  )
}
