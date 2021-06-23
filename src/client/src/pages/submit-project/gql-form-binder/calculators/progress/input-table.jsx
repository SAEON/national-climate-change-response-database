import Typography from '@material-ui/core/Typography'
import { DataGrid } from '@material-ui/data-grid'
import useTheme from '@material-ui/core/styles/useTheme'
import getCellValue from '../get-cell-value.js'
import ControlledVocabularySelect from '../../_controlled-vocabulary-select'
import clsx from 'clsx'
import useStyles from './style'

export default ({ calculator, updateCalculator }) => {
  const classes = useStyles()
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

  const years = new Array(yearCount).fill(null).map((_, i) => _start + i)

  const rows1 = years.map(year => ({
    id: year,
    year,
    achieved: getCellValue({
      calculator: 'progress',
      startYear: _start,
      currentYear: year,
      grid: grid1,
      field: 'achieved',
    }),
    achievedUnit: getCellValue({
      calculator: 'progress',
      startYear: _start,
      currentYear: year,
      grid: grid1,
      field: 'achievedUnit',
    }),
  }))

  const rows2 = years.map(year => ({
    id: year,
    year,
    expenditureZar: getCellValue({
      calculator: 'expenditure',
      startYear: _start,
      currentYear: year,
      grid: grid2,
      field: 'expenditureZar',
    }),
  }))

  return (
    <div>
      {/* SECTOR ACHIEVEMENTS CALCULATOR */}
      <Typography
        variant="overline"
        style={{ textAlign: 'center', margin: theme.spacing(2), display: 'block' }}
      >
        Progress calculator
      </Typography>
      <div style={{ height: rows1.length <= 6 ? rows1.length * 52 + 58 : 300, width: '100%' }}>
        <DataGrid
          pageSize={100}
          columns={[
            { field: 'year', headerName: 'Year', editable: false, width: 120 },
            {
              field: 'achievedUnit',
              headerName: 'Unit of achievements',
              editable: false,
              flex: 1,
              sortable: false,
              filterable: false,
              disableColumnMenu: true,
              cellClassName: () => clsx(classes.cell),
              renderCell: ({ row: { id, achievedUnit } }) => {
                return (
                  <ControlledVocabularySelect
                    tree={'mitigationUnits'}
                    root="Unit"
                    value={achievedUnit}
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
              },
            },
            {
              field: 'achieved',
              headerName: 'How much was generated/saved/avoided achieved',
              type: 'number',
              editable: true,
              width: 450,
            },
          ]}
          rows={rows1}
          hideFooter={rows1.length < 100 ? true : false}
          onEditCellChangeCommitted={({ id, field, props }) => {
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
                          [field]: props.value,
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
        Effects calculator
      </Typography>
      <div style={{ height: rows2.length <= 6 ? rows2.length * 52 + 58 : 300, width: '100%' }}>
        <DataGrid
          pageSize={100}
          columns={[
            { field: 'year', headerName: 'Year', editable: false, width: 120 },
            {
              field: 'expenditureZar',
              headerName: 'Expenditure in (ZAR)',
              type: 'number',
              editable: true,
              width: 350,
            },
          ]}
          rows={rows2}
          hideFooter={rows2.length < 100 ? true : false}
          onEditCellChangeCommitted={({ id, field, props }) => {
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
                          [field]: props.value,
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
