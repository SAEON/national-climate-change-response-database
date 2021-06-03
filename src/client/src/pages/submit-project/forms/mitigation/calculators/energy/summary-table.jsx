import Typography from '@material-ui/core/Typography'
import { DataGrid } from '@material-ui/data-grid'
import { getNumericCellValue } from './input-tables'
import useTheme from '@material-ui/core/styles/useTheme'

const columns = [
  { field: 'type', headerName: 'Renewable', editable: false, type: 'string', width: 200 },
  {
    field: 'annualKwh',
    headerName: 'Total kWh project lifespan',
    editable: false,
    type: 'number',
    width: 280,
  },
  {
    field: 'annualKwhPurchaseReduction',
    headerName: 'Total annual reduction of grid purchases (kWh)',
    editable: false,
    type: 'number',
    width: 280,
  },
]

export default ({ calculator }) => {
  const theme = useTheme()
  const { grid = {}, startYear: _startYear, endYear: _endYear } = calculator

  /**
   * No numerical values entered yet
   */
  if (!Object.keys(grid).length) {
    return null
  }

  const startYear = new Date(_startYear).getFullYear()
  const endYear = new Date(_endYear).getFullYear()
  const yearCount = endYear - startYear + 1

  /**
   * Incorrect year values entered
   */
  if (yearCount < 1) {
    return null
  }

  const years = new Array(yearCount).fill(null).map((_, i) => [startYear + i, null])

  const rows = Object.entries(grid).reduce((rows, [type, info]) => {
    const row = Object.entries(Object.assign(Object.fromEntries(years), info)).reduce(
      (columns, [currentYear]) => {
        columns.annualKwh += parseInt(
          getNumericCellValue({
            startYear,
            currentYear,
            field: 'annualKwh',
            type,
            grid,
          }),
          10
        )

        columns.annualKwhPurchaseReduction += parseInt(
          getNumericCellValue({
            startYear,
            currentYear,
            field: 'annualKwhPurchaseReduction',
            type,
            grid,
          }),
          10
        )

        return Object.assign({ id: type, type }, columns)
      },
      { annualKwh: 0, annualKwhPurchaseReduction: 0 }
    )

    rows.push(row)
    return rows
  }, [])

  return (
    <div>
      <Typography
        variant="overline"
        style={{ textAlign: 'center', margin: theme.spacing(2), display: 'block' }}
      >
        Project energy usage summary
      </Typography>
      <div style={{ display: 'flex', width: '100%' }}>
        <DataGrid autoHeight hideFooter rows={rows} columns={columns} />
      </div>
    </div>
  )
}
