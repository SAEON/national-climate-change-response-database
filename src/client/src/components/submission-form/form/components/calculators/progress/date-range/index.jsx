import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import { parseISO, subYears } from 'date-fns'

export default ({ calculator, update }) => {
  const { startYear = null, endYear = null } = calculator
  const min = subYears(new Date(), 50)

  return (
    <Grid container spacing={2}>
      {/* START DATE */}
      <Grid item xs={12} sm={6} sx={{ paddingTop: 0, paddingBottom: 0 }}>
        <DatePicker
          renderInput={params => (
            <TextField
              helperText={'What year did/will the project start?'}
              fullWidth
              variant="outlined"
              margin="normal"
              {...params}
            />
          )}
          clearable
          autoOk
          minDate={min}
          maxDate={new Date()}
          views={['year']}
          placeholder={'Start year'}
          label={'Start year'}
          id="progress-calculator-start"
          value={parseISO(startYear)}
          onChange={value =>
            update({
              calculator: Object.assign(
                { ...calculator },
                {
                  startYear: value.toISOString(),
                  grid1: {},
                  grid2: {},
                }
              ),
            })
          }
        />
      </Grid>

      {/* END DATE */}
      <Grid item xs={12} sm={6} sx={{ paddingTop: 0, paddingBottom: 0 }}>
        <DatePicker
          renderInput={params => (
            <TextField
              helperText={'Select up to previous calendar year'}
              fullWidth
              variant="outlined"
              margin="normal"
              {...params}
            />
          )}
          clearable
          autoOk
          minDate={min}
          maxDate={new Date()}
          views={['year']}
          placeholder={'End year'}
          label={'End year'}
          id="progress-calculator-end"
          value={parseISO(endYear)}
          onChange={value =>
            update({
              calculator: Object.assign(
                { ...calculator },
                {
                  endYear: value.toISOString(),
                  grid1: {},
                  grid2: {},
                }
              ),
            })
          }
        />
      </Grid>
    </Grid>
  )
}
