import { memo, useMemo } from 'react'
import InputTables from './tables'
import QuickForm from '../../../../../quick-form'
import debounce from '../../../../../../lib/debounce'
import DateRange from './date-range'

export default memo(
  ({ calculator = {}, updateCalculator = {}, renderAchievement, renderExpenditure }) => {
    const effect = useMemo(
      () => debounce(({ calculator }) => updateCalculator(calculator)),
      [updateCalculator]
    )

    return (
      <QuickForm effects={[effect]} calculator={calculator}>
        {(update, { calculator }) => (
          <>
            <DateRange calculator={calculator} update={update} />
            <InputTables
              renderAchievement={renderAchievement}
              renderExpenditure={renderExpenditure}
              calculator={calculator}
              updateCalculator={value => update({ calculator: value })}
            />
          </>
        )}
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
