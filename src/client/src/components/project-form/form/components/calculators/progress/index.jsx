import { memo, useMemo } from 'react'
import { DatePicker } from '@material-ui/pickers'
import Grid from '@material-ui/core/Grid'
import InputTables from './input-tables'
import QuickForm from '../../../../../quick-form'
import debounce from '../../../../../../lib/debounce'

export default memo(
  ({ calculator = {}, updateCalculator = {} }) => {
    const effect = useMemo(
      () => debounce(({ calculator }) => updateCalculator(calculator)),
      [updateCalculator]
    )

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
                    fullWidth
                    inputVariant="outlined"
                    margin="normal"
                    clearable
                    autoOk
                    minDate={'2000'}
                    maxDate={new Date().getFullYear().toString()}
                    variant="dialog"
                    views={['year']}
                    animateYearScrolling
                    format="yyyy"
                    placeholder={'Start year'}
                    label={'Start year'}
                    id="progress-calculator-mitigation-start"
                    helperText={'What year did/will the mitigation project start?'}
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
                    fullWidth
                    inputVariant="outlined"
                    margin="normal"
                    clearable
                    variant="dialog"
                    autoOk
                    minDate={'2000'}
                    maxDate={new Date().getFullYear().toString()}
                    views={['year']}
                    animateYearScrolling
                    format="yyyy"
                    placeholder={'End year'}
                    label={'End year'}
                    id="progress-calculator-mitigation-end"
                    helperText={'Select up to previous calendar year'}
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
