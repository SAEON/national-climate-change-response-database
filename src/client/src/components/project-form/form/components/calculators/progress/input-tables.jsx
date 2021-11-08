import Typography from '@mui/material/Typography'
import DataGrid, { TextEditor } from 'react-data-grid'
import { useTheme } from '@mui/material/styles'
import getCellValue from '../get-cell-value.js'
import ControlledVocabularySelect from '../../controlled-vocabulary-select'

export default ({ calculator, updateCalculator }) => {
  const theme = useTheme()
  const { startYear = null, endYear = null, grid1 = {}, grid2 = {} } = calculator

  if (!startYear || !endYear) {
    return null
  }

  const _start = new Date(startYear).getFullYear()
  const _end = new Date(endYear).getFullYear()
  const yearCount = _end - _start + 1

  if (yearCount < 1) {
    return null
  }

  const years = new Array(yearCount)
    .fill(null)
    .map((_, i) => _start + i)
    .reverse()

  const rows1 = years.map(year => ({
    id: year,
    year,
    achieved: getCellValue({
      calculator: 'progress',
      endYear: _end,
      currentYear: year,
      grid: grid1,
      key: 'achieved',
    }),
    achievedUnit: getCellValue({
      calculator: 'progress',
      endYear: _end,
      currentYear: year,
      grid: grid1,
      key: 'achievedUnit',
    }),
  }))

  const rows2 = years.map(year => ({
    id: year,
    year,
    expenditureZar: getCellValue({
      calculator: 'expenditure',
      endYear: _end,
      currentYear: year,
      grid: grid2,
      key: 'expenditureZar',
    }),
  }))

  return (
    <div>
      {/* SECTOR ACHIEVEMENTS CALCULATOR */}
      <Typography
        variant="overline"
        style={{
          textAlign: 'center',
          marginTop: theme.spacing(2),
          marginRight: theme.spacing(2),
          marginLeft: theme.spacing(2),
          display: 'block',
        }}
      >
        Achievement reporting
      </Typography>
      <Typography
        variant="caption"
        style={{
          display: 'block',
          textAlign: 'center',
          fontStyle: 'italic',
          marginBottom: theme.spacing(2),
        }}
      >
        e.g a Number of Kilowatt-hours of electricity generated, Kilowatt-hours of electricity
        saved, Kilograms of waste saved
      </Typography>
      <div style={{ height: rows1.length <= 6 ? rows1.length * 52 + 58 : 300, width: '100%' }}>
        <DataGrid
          style={{ height: '100%' }}
          enableVirtualization={true}
          columns={[
            { key: 'year', name: 'Year', width: 120 },
            {
              key: 'achieved',
              name: 'How much was generated/saved/avoided achieved',
              type: 'number',
              editor: TextEditor,
              width: 450,
            },
            {
              key: 'achievedUnit',
              name: 'Unit of achievements',
              formatter: ({ row: { id, achievedUnit } }) => (
                <ControlledVocabularySelect
                  tree={'mitigationUnits'}
                  root="Unit"
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
              ),
            },
          ]}
          rows={rows1}
          hideFooter={rows1.length < 100 ? true : false}
          onEditCellChangeCommitted={({ id, key, props }) => {
            return updateCalculator(
              Object.assign(
                { ...calculator },
                {
                  grid1: Object.assign(
                    { ...grid1 },
                    {
                      [id]: Object.assign(
                        { ...(grid1?.[id] || {}) },
                        {
                          [key]: props.value,
                        }
                      ),
                    }
                  ),
                }
              )
            )
          }}
        />
      </div>

      {/* EXPENDITURE CALCULATOR */}
      <Typography
        variant="overline"
        style={{ textAlign: 'center', margin: theme.spacing(2), display: 'block' }}
      >
        Project expenditure
      </Typography>
      <Typography
        variant="caption"
        style={{
          display: 'block',
          textAlign: 'center',
          fontStyle: 'italic',
          marginBottom: theme.spacing(2),
        }}
      >
        The term &quot;project expenditure&quot; refers to the annual cost of the previous calendar
        year. This is not the project&apos;s total budget; however, it is a breakdown of the annual
        financial expenditures.
      </Typography>
      <div style={{ height: rows2.length <= 6 ? rows2.length * 52 + 58 : 300, width: '100%' }}>
        <DataGrid
          pageSize={100}
          columns={[
            { key: 'year', name: 'Year', editable: false, width: 120 },
            {
              key: 'expenditureZar',
              name: 'Expenditure in (ZAR)',
              type: 'number',
              editor: TextEditor,
            },
          ]}
          rows={rows2}
          hideFooter={rows2.length < 100 ? true : false}
          onEditCellChangeCommitted={({ id, key, props }) => {
            return updateCalculator(
              Object.assign(
                { ...calculator },
                {
                  grid2: Object.assign(
                    { ...grid2 },
                    {
                      [id]: Object.assign(
                        { ...(grid2?.[id] || {}) },
                        {
                          [key]: props.value,
                        }
                      ),
                    }
                  ),
                }
              )
            )
          }}
        />
      </div>
    </div>
  )
}
