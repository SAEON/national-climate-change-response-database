import { memo, useMemo } from 'react'
import ControlledVocabularySelectMultiple from '../../controlled-vocabulary-select-multiple'
import DatePicker from '@mui/lab/DatePicker'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import InputTables from './input-tables'
import SummaryTable from './summary-table'
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
          const { renewableTypes = [], startYear = null, endYear = null, grid = {} } = calculator

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
                    minDate="1990"
                    maxDate="2089"
                    views={['year']}
                    placeholder={'Start year'}
                    label={'Start year'}
                    id="energy-calculator-mitigation-start"
                    value={startYear}
                    onChange={value =>
                      update({
                        calculator: Object.assign(
                          { ...calculator },
                          {
                            startYear: value,
                            grid: Object.fromEntries(
                              Object.entries(grid).map(([renewableType, info]) => {
                                return [
                                  renewableType,
                                  Object.fromEntries(
                                    Object.entries(info).filter(([year]) => {
                                      const valueYear = new Date(value).getFullYear()
                                      return year >= valueYear
                                    })
                                  ),
                                ]
                              })
                            ),
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
                        fullWidth
                        helperText={'What year did/will the mitigation project end?'}
                        variant="outlined"
                        margin="normal"
                        {...params}
                      />
                    )}
                    clearable
                    autoOk
                    minDate="1990"
                    maxDate="2089"
                    views={['year']}
                    placeholder={'End year'}
                    label={'End year'}
                    id="energy-calculator-mitigation-end"
                    value={endYear}
                    onChange={value =>
                      update({
                        calculator: Object.assign(
                          { ...calculator },
                          {
                            endYear: value,
                            grid: Object.fromEntries(
                              Object.entries(grid).map(([renewableType, info]) => {
                                return [
                                  renewableType,
                                  Object.fromEntries(
                                    Object.entries(info).filter(([year]) => {
                                      const valueYear = new Date(value).getFullYear()
                                      return year <= valueYear
                                    })
                                  ),
                                ]
                              })
                            ),
                          }
                        ),
                      })
                    }
                  />
                </Grid>
              </Grid>

              <ControlledVocabularySelectMultiple
                id="energy-calculator"
                helperText="Select all applicable renewable energy types"
                label={'Renewable energy types'}
                roots={['Energy source']}
                tree="renewableTypes"
                value={renewableTypes}
                setValue={value =>
                  update({
                    calculator: Object.assign(
                      { ...calculator },
                      {
                        renewableTypes: value,
                      }
                    ),
                  })
                }
              />

              {/* INPUT TABLES */}
              <InputTables
                calculator={calculator}
                updateCalculator={value => update({ calculator: value })}
              />

              {/* SUMMARY TABLE */}
              <SummaryTable calculator={calculator} />
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
