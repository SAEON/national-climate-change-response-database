import WithControlledVocabulary from '../../_with-controlled-vocabulary'
import Multiselect from '../../../../../components/multiselect'
import { DatePicker } from '@material-ui/pickers'
import Grid from '@material-ui/core/Grid'
import InputTables from './input-tables'

export default ({ calculator = {}, updateCalculator = {} }) => {
  const {
    emissionTypes = [],
    chemicals = [],
    startYear = null,
    endYear = null,
    grid = {},
  } = calculator

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
            id="emissions-calculator-mitigation-start"
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
            id="emissions-calculator-mitigation-end"
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

      {/* EMISSION CATEGORIES */}
      <WithControlledVocabulary root="Emission" tree="emissionTypes">
        {({ options }) => {
          return (
            <Multiselect
              id="emissions-calculator-types"
              options={options.map(({ term }) => term)}
              value={emissionTypes}
              helperText="Select all applicable emissions types"
              label={'Emissions types'}
              setValue={value =>
                updateCalculator(
                  Object.assign(
                    { ...calculator },
                    {
                      emissionTypes: value,
                    }
                  )
                )
              }
            />
          )
        }}
      </WithControlledVocabulary>

      {/* EMISSION CHEMICALS */}
      <WithControlledVocabulary root="Chemical" tree="emissions">
        {({ options }) => {
          return (
            <Multiselect
              id="emissions-calculator-chemicals"
              options={options.map(({ term }) => term)}
              value={chemicals}
              helperText="Select all applicable emission chemicals"
              label={'Emission chemicals'}
              setValue={value =>
                updateCalculator(
                  Object.assign(
                    { ...calculator },
                    {
                      chemicals: value,
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
    </>
  )
}
