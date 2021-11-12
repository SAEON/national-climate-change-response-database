import ControlledVocabularySelect from '../../../../controlled-vocabulary-select'
import useTheme from '@mui/material/styles/useTheme'

export default ({ calculator, updateCalculator, grid1, row: { id, achievedUnit } }) => {
  const theme = useTheme()

  return (
    <ControlledVocabularySelect
      tree={'mitigationUnits'}
      root="Unit"
      margin="none"
      size="small"
      variant="standard"
      SelectProps={{
        renderValue: value => (
          <div
            style={{
              padding: theme.spacing(0.5),
              paddingRight: theme.spacing(4),
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}
          >
            {value}
          </div>
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
