import Typography from '@material-ui/core/Typography'
import { DataGrid } from '@material-ui/data-grid'
import useTheme from '@material-ui/core/styles/useTheme'
import getCellValue from '../get-cell-value.js'

const columns = [
  { field: 'year', headerName: 'Year', editable: false, width: 120 },
  { field: 'notes', headerName: 'Notes', type: 'string', editable: true, flex: 1 },
  { field: 'annualKwh', headerName: 'Annual kWh', type: 'number', editable: true, width: 180 },
  {
    field: 'annualKwhPurchaseReduction',
    headerName: 'Annual reduction in electricity purchased from the grid (kWh)',
    type: 'number',
    editable: true,
    width: 320,
  },
]

export default ({ calculator, updateCalculator }) => {
  const theme = useTheme()
  const { renewableTypes = [], startYear = null, endYear = null, grid = {} } = calculator

  if (!renewableTypes.length || !startYear || !endYear) {
    return null
  }

  const _start = new Date(startYear).getFullYear()
  const _end = new Date(endYear).getFullYear()
  const yearCount = _end - _start + 1

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
        annualKwh: getCellValue({
          startYear: _start,
          currentYear: year,
          type,
          grid,
          field: 'annualKwh',
        }),
        annualKwhPurchaseReduction: getCellValue({
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
          Enter {type} energy usage
        </Typography>
        <div style={{ height: rows.length <= 6 ? rows.length * 52 + 58 : 300, width: '100%' }}>
          <DataGrid
            pageSize={100}
            rows={rows}
            columns={columns}
            hideFooter={rows.length < 100 ? true : false}
            onEditCellChangeCommitted={({ id, field, props }) => {
              return updateCalculator(
                Object.assign(
                  { ...calculator },
                  {
                    grid: Object.assign(
                      { ...grid },
                      {
                        [type]: Object.assign(
                          { ...(grid?.[type] || {}) },
                          {
                            [id]: Object.assign(
                              { ...(grid?.[type]?.[id] || {}) },
                              {
                                [field]: props.value,
                              }
                            ),
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
  })
}
