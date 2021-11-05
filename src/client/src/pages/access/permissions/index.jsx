import { useContext } from 'react'
import { context as authContext } from '../../../contexts/authorization'
import { context as accessContext } from '../context'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'
import { DataGrid } from '@material-ui/data-grid'

export default ({ permission }) => {
  const theme = useTheme()
  const { hasPermission } = useContext(authContext)
  const { permissions } = useContext(accessContext)

  if (!hasPermission(permission)) {
    return null
  }

  return (
    <Card
      style={{ border: 'none', width: '100%', backgroundColor: theme.backgroundColor }}
      variant="outlined"
    >
      <CardContent style={{ padding: 0 }}>
        <div style={{ height: 1000 }}>
          <DataGrid
            pageSize={25}
            rowHeight={theme.spacing(5)}
            columns={[
              {
                field: 'id',
                sortable: false,
                filterable: false,
                disableColumnMenu: true,
                headerName: 'ID',
                width: 50,
              },
              { field: 'name', headerName: 'Name', width: 200 },
              {
                field: 'description',
                headerName: 'Description',
                flex: 1,
                sortable: false,
                filterable: false,
                disableColumnMenu: true,
              },
            ]}
            rows={permissions.map(({ id, name, description }) => ({ id, name, description }))}
          />
        </div>
      </CardContent>
    </Card>
  )
}
