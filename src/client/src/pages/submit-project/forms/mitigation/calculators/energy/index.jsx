import { WithControlledVocabulary } from '../../../../gql-form-binder'
import Multiselect from '../../../../../../components/multiselect'

export default ({ calculator = {}, updateCalculator = {} }) => {
  const { renewableTypes = [] } = calculator

  return (
    <WithControlledVocabulary root="Energy source" tree="renewableTypes">
      {({ options }) => {
        return (
          <Multiselect
            id="energy-calculator"
            options={options.map(({ term }) => term)}
            value={renewableTypes}
            label={'Select renewable types'}
            setValue={value => {
              updateCalculator(
                Object.assign(
                  { ...calculator },
                  {
                    renewableTypes: value,
                  }
                )
              )
            }}
          />
        )
      }}
    </WithControlledVocabulary>
  )
}
