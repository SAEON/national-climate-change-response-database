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
      field: 'achieved',
    }),
    achievedUnit: getCellValue({
      calculator: 'progress',
      endYear: _end,
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
      endYear: _end,
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
          pageSize={100}
          columns={[
            { field: 'year', headerName: 'Year', editable: false, width: 120 },
            {
              field: 'achieved',
              headerName: 'How much was generated/saved/avoided achieved',
              type: 'number',
              editable: true,
              width: 450,
            },
            {
              field: 'achievedUnit',
              headerName: 'Unit of achievements',
              editable: false,
              flex: 1,
              sortable: false,
              filterable: false,
              disableColumnMenu: true,
              cellClassName: () => clsx(classes.cell),
              renderCell: ({ row: { id, achievedUnit } }) => (
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
        Project expenditure
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
