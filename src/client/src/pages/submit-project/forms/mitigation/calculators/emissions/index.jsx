import { WithControlledVocabulary } from '../../../../gql-form-binder'
import Multiselect from '../../../../../../components/multiselect'
import { DatePicker } from '@material-ui/pickers'
import Grid from '@material-ui/core/Grid'

export default ({ calculator = {}, updateCalculator = {} }) => {
  const { emissionTypes = [], startYear = null, endYear = null } = calculator

  return (
    <>
      <WithControlledVocabulary root="Emission" tree="emissionTypes">
        {({ options }) => {
          return (
            <Multiselect
              id="emissions-calculator"
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

      {/* DATE RANGE */}
      <Grid container spacing={2}>
        {/* START DATE */}
        <Grid item xs={12} sm={6}>
          <DatePicker
            fullWidth
            inputVariant="outlined"
            margin="normal"
            clearable
            variant="dialog"
            views={['year']}
            animateYearScrolling
            format="yyyy"
            placeholder={'Start year'}
            label={'Start year'}
            id="emission-calculator-mitigation-start"
            helperText={'What year did/will the mitigation project start?'}
            value={startYear}
            onChange={value =>
              updateCalculator(Object.assign({ ...calculator }, { startYear: value }))
            }
          />
        </Grid>

        {/* END DATE */}
        <Grid item xs={12} sm={6}>
          <DatePicker
            fullWidth
            inputVariant="outlined"
            margin="normal"
            clearable
            variant="dialog"
            views={['year']}
            animateYearScrolling
            format="yyyy"
            placeholder={'End year'}
            label={'End year'}
            id="emission-calculator-mitigation-end"
            helperText={'What year did/will the mitigation project end?'}
            value={endYear}
            onChange={value =>
              updateCalculator(Object.assign({ ...calculator }, { endYear: value }))
            }
          />
        </Grid>
      </Grid>
    </>
  )
}
