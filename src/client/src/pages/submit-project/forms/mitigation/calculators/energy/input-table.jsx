import Typography from '@material-ui/core/Typography'
import { DataGrid } from '@material-ui/data-grid'

const columns = [
  { field: 'year', headerName: 'Year', editable: false, width: 150 },
  { field: 'notes', headerName: 'Notes', type: 'string', editable: true, width: 180 },
  { field: 'totalKwh', headerName: 'Annual total kWh', type: 'number', editable: true, width: 150 },
  {
    field: 'annualPurchaseReductionKwh',
    headerName: 'Annual reduction in electricity purchased from the grid (kWh)',
    type: 'number',
    editable: true,
    width: 150,
  },
]

export default ({ calculator, updateCalculator }) => {
  const { renewableTypes = [], startYear = null, endYear = null, grid = {} } = calculator

  if (!renewableTypes.length || !startYear || !endYear) {
    return null
  }

  const _start = new Date(startYear).getFullYear()
  const _end = new Date(endYear).getFullYear()
  const yearCount = _end - _start
  const years = new Array(yearCount).fill(null).map((_, i) => _start + i)

  return renewableTypes.map(type => {
    return (
      <div key={type}>
        <Typography>Energy calculator ({type})</Typography>
        <div style={{ height: 300, width: '100%' }}>
          <DataGrid
            rows={years.map(year => {
              return {
                id: year,
                year,
                notes: grid?.[type]?.[year]?.notes || '',
                totalKwh: grid?.[type]?.[year]?.totalKwh || 0,
                annualPurchaseReductionKwh: grid?.[type]?.[year]?.annualPurchaseReductionKwh || 0,
              }
            })}
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
