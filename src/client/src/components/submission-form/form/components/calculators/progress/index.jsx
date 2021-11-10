import { memo, useMemo } from 'react'
import DatePicker from '@mui/lab/DatePicker'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import InputTables from './input-tables'
import QuickForm from '../../../../../quick-form'
import debounce from '../../../../../../lib/debounce'
import { parseISO, subYears, addYears } from 'date-fns'

export default memo(
  ({ calculator = {}, updateCalculator = {} }) => {
    const effect = useMemo(
      () => debounce(({ calculator }) => updateCalculator(calculator)),
      [updateCalculator]
    )

    const min = subYears(new Date(), 50)

    return (
      <QuickForm effect={effect} calculator={calculator}>
        {(update, { calculator }) => {
          const { startYear = null, endYear = null } = calculator

          return (
            <>
              {/* DATE RANGE */}
              <Grid container spacing={2}>
                {/* START DATE */}
                <Grid item xs={12} sm={6} style={{ paddingTop: 0, paddingBottom: 0 }}>
                  <DatePicker
                    renderInput={params => (
                      <TextField
                        helperText={'What year did/will the mitigation project start?'}
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
                    id="progress-calculator-mitigation-start"
                    value={startYear}
                    onChange={value =>
                      update({
                        calculator: Object.assign(
                          { ...calculator },
                          {
                            startYear: value,
                            grid1: {},
                            grid2: {},
                          }
                        ),
                      })
                    }
                  />
                </Grid>

                {/* END DATE */}
                <Grid item xs={12} sm={6} style={{ paddingTop: 0, paddingBottom: 0 }}>
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
                    id="progress-calculator-mitigation-end"
                    value={endYear}
                    onChange={value =>
                      update({
                        calculator: Object.assign(
                          { ...calculator },
                          {
                            endYear: value,
                            grid1: {},
                            grid2: {},
                          }
                        ),
                      })
                    }
                  />
                </Grid>
              </Grid>

              {/* INPUT TABLES */}
              <InputTables
                calculator={calculator}
                updateCalculator={value => update({ calculator: value })}
              />
            </>
          )
        }}
      </QuickForm>
    )
  },
  /**
   * State is managed internally, and synced
   * to context.
   *
   * Never re-render this component once mounted
   */
  () => true
)
