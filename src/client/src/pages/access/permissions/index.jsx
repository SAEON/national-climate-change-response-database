import { useContext } from 'react'
import { context as authContext } from '../../../contexts/authorization'
import { context as accessContext } from '../context'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import useTheme from '@material-ui/core/styles/useTheme'
import { DataGrid } from '@material-ui/data-grid'

export default ({ access }) => {
  const theme = useTheme()
  const { hasRole } = useContext(authContext)
  const { permissions } = useContext(accessContext)
  if (!hasRole(access)) {
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
              { field: 'id', headerName: 'ID', width: 90 },
              { field: 'name', headerName: 'Name', width: 200 },
              { field: 'description', headerName: 'Description', width: 550 },
            ]}
            rows={permissions.map(({ id, name, description }) => ({ id, name, description }))}
          />
        </div>
      </CardContent>
    </Card>
  )
}
