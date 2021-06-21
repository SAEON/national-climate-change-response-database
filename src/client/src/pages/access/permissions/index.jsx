import { useContext } from 'react'
import { context as authContext } from '../../../contexts/authorization'
import { context as accessContext } from '../context'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import useTheme from '@material-ui/core/styles/useTheme'
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
