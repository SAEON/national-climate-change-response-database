import WithControlledVocabulary from '../../_with-controlled-vocabulary'
import Multiselect from '../../../../../components/multiselect'
import { DatePicker } from '@material-ui/pickers'
import Grid from '@material-ui/core/Grid'
import InputTables from './input-tables'
import SummaryTable from './summary-table'

export default ({ calculator = {}, updateCalculator = {} }) => {
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
              updateCalculator(
                Object.assign(
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
                )
              )
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
              updateCalculator(
                Object.assign(
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
                )
              )
            }
          />
        </Grid>
      </Grid>

      <WithControlledVocabulary root="Energy source" tree="renewableTypes">
        {({ options }) => {
          return (
            <Multiselect
              id="energy-calculator"
              options={options.map(({ term }) => term)}
              value={renewableTypes}
              helperText="Select all applicable renewable energy types"
              label={'Renewable energy types'}
              setValue={value =>
                updateCalculator(
                  Object.assign(
                    { ...calculator },
                    {
                      renewableTypes: value,
                    }
                  )
                )
              }
            />
          )
        }}
      </WithControlledVocabulary>

      {/* INPUT TABLES */}
      <InputTables calculator={calculator} updateCalculator={updateCalculator} />

      {/* SUMMARY TABLE */}
      <SummaryTable calculator={calculator} />
    </>
  )
}
