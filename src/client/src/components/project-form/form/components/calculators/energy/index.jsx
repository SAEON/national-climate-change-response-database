import { memo, useMemo } from 'react'
import ControlledVocabularySelectMultiple from '../../controlled-vocabulary-select-multiple'
import { DatePicker } from '@material-ui/pickers'
import Grid from '@material-ui/core/Grid'
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
                    fullWidth
                    inputVariant="outlined"
                    margin="normal"
                    clearable
                    autoOk
                    minDate="1990"
                    maxDate="2089"
                    variant="dialog"
                    views={['year']}
                    animateYearScrolling
                    format="yyyy"
                    placeholder={'Start year'}
                    label={'Start year'}
                    id="energy-calculator-mitigation-start"
                    helperText={'What year did/will the mitigation project start?'}
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
                    fullWidth
                    inputVariant="outlined"
                    margin="normal"
                    clearable
                    variant="dialog"
                    autoOk
                    minDate="1990"
                    maxDate="2089"
                    views={['year']}
                    animateYearScrolling
                    format="yyyy"
                    placeholder={'End year'}
                    label={'End year'}
                    id="energy-calculator-mitigation-end"
                    helperText={'What year did/will the mitigation project end?'}
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
                root="Energy source"
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
