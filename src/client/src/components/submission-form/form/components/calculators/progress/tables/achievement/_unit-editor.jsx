import ControlledVocabularySelect from '../../../../controlled-vocabulary-select'
import { Div } from '../../../../../../../html-tags'

export default ({ calculator, updateCalculator, grid1, row: { id, achievedUnit } }) => {
  return (
    <ControlledVocabularySelect
      tree={'mitigationUnits'}
      root="Unit"
      margin="none"
      size="small"
      variant="standard"
      SelectProps={{
        renderValue: value => (
          <Div
            sx={{
              padding: theme => theme.spacing(0.5),
              paddingRight: theme => theme.spacing(4),
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {value}
          </Div>
        ),
        SelectDisplayProps: { style: { padding: 0 } },
      }}
      value={achievedUnit.term ? achievedUnit : { term: '(NONE)' }}
      onChange={value => {
        updateCalculator(
          Object.assign(
            { ...calculator },
            {
              grid1: Object.assign(
                { ...grid1 },
                {
                  [id]: Object.assign(
                    { ...(grid1?.[id] || {}) },
                    {
                      achievedUnit: value,
                    }
                  ),
                }
              ),
            }
          )
        )
      }}
    />
  )
}
