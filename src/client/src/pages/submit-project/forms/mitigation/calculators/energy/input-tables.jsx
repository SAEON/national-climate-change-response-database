import Typography from '@material-ui/core/Typography'
import { DataGrid } from '@material-ui/data-grid'
import useTheme from '@material-ui/core/styles/useTheme'

const columns = [
  { field: 'year', headerName: 'Year', editable: false, width: 120 },
  { field: 'notes', headerName: 'Notes', type: 'string', editable: true, width: 180 },
  { field: 'annualKwh', headerName: 'Annual kWh', type: 'number', editable: true, width: 250 },
  {
    field: 'annualKwhPurchaseReduction',
    headerName: 'Annual reduction in electricity purchased from the grid (kWh)',
    type: 'number',
    editable: true,
    width: 250,
  },
]

export const getNumericCellValue = ({ startYear, type, currentYear, grid, field }) => {
  for (let _currentYear = currentYear; _currentYear >= startYear; _currentYear--) {
    const val = grid?.[type]?.[_currentYear]?.[field]
    if (val) {
      return val
    }
  }

  return 0
}

export default ({ calculator, updateCalculator }) => {
  const theme = useTheme()
  const { renewableTypes = [], startYear = null, endYear = null, grid = {} } = calculator

  if (!renewableTypes.length || !startYear || !endYear) {
    return null
  }

  const _start = new Date(startYear).getFullYear()
  const _end = new Date(endYear).getFullYear()
  const yearCount = _end - _start

  if (yearCount < 1) {
    return null
  }

  const years = new Array(yearCount).fill(null).map((_, i) => _start + i)

  return renewableTypes.map(type => {
    const rows = years.map(year => {
      return {
        id: year,
        year,
        notes: grid?.[type]?.[year]?.notes || '',
        annualKwh: getNumericCellValue({
          startYear: _start,
          currentYear: year,
          type,
          grid,
          field: 'annualKwh',
        }),
        annualKwhPurchaseReduction: getNumericCellValue({
          startYear: _start,
          currentYear: year,
          type,
          grid,
          field: 'annualKwhPurchaseReduction',
        }),
      }
    })

    return (
      <div key={type}>
        <Typography
          variant="overline"
          style={{ textAlign: 'center', margin: theme.spacing(2), display: 'block' }}
        >
          Calculate {type} energy usage
        </Typography>
        <div style={{ height: 300, width: '100%' }}>
          <DataGrid
            pageSize={100}
            rows={rows}
            columns={columns}
            onEditCellChangeCommitted={({ id, field, props }) =>
              updateCalculator(
                Object.assign(
                  { ...calculator },
                  {
                    grid: Object.assign(
                      { ...grid },
                      {
                        [type]: Object.assign(
                          { ...grid[type] },
                          {
                            [id]: {
                              [field]: props.value,
                            },
                          }
                        ),
                      }
                    ),
                  }
                )
              )
            }
          />
        </div>
      </div>
    )
  })
}
