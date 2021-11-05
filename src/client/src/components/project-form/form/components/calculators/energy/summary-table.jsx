import Typography from '@mui/material/Typography'
import { DataGrid } from '@material-ui/data-grid'
import reduceGrid from '../reduce-grid.js'
import { useTheme } from '@mui/material/styles'

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
  const rows = reduceGrid({ fields: ['annualKwh', 'annualKwhPurchaseReduction'], calculator })

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
