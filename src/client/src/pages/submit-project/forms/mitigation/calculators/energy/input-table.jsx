import Typography from '@material-ui/core/Typography'
import { DataGrid } from '@material-ui/data-grid'
import useTheme from '@material-ui/core/styles/useTheme'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'

const columns = [
  { field: 'year', headerName: 'Year', editable: false, width: 120 },
  { field: 'notes', headerName: 'Notes', type: 'string', editable: true, width: 180 },
  { field: 'totalKwh', headerName: 'Annual total kWh', type: 'number', editable: true, width: 250 },
  {
    field: 'annualPurchaseReductionKwh',
    headerName: 'Annual reduction in electricity purchased from the grid (kWh)',
    type: 'number',
    editable: true,
    width: 250,
  },
]

const getValue = ({ startYear, type, currentYear, grid, field }) => {
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
        totalKwh: getValue({
          startYear: _start,
          currentYear: year,
          type,
          grid,
          field: 'totalKwh',
        }),
        annualPurchaseReductionKwh: getValue({
          startYear: _start,
          currentYear: year,
          type,
          grid,
          field: 'annualPurchaseReductionKwh',
        }),
      }
    })

    console.log('rows', rows)
    // TODO - add back pagination controls if last page
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
            components={{
              Footer: () => {
                return (
                  <AppBar position="relative" variant="outlined" color="primary">
                    <Toolbar variant="dense">hi</Toolbar>
                  </AppBar>
                )
              },
            }}
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
