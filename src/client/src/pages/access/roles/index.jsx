import { useContext } from 'react'
import { context as authContext } from '../../../contexts/authorization'
import { context as accessContext } from '../context'
import CardContent from '@material-ui/core/CardContent'
import useTheme from '@material-ui/core/styles/useTheme'
import Grid from '@material-ui/core/Grid'
import { DataGrid } from '@material-ui/data-grid'
import Collapse from '../../../components/collapse'

export default ({ permission }) => {
  const theme = useTheme()
  const { hasPermission } = useContext(authContext)
  const { roles } = useContext(accessContext)
  if (!hasPermission(permission)) {
    return null
  }

  return (
    <Grid container spacing={2}>
      {roles.map(({ name, description, permissions }) => {
        return (
          <Grid key={name} item xs={12}>
            <Collapse
              cardStyle={{ border: 'none' }}
              title={`${name.toUpperCase()} permissions`}
              subheader={description}
            >
              <CardContent>
                <div style={{ height: 400 }}>
                  <DataGrid
                    pageSize={25}
                    rowHeight={theme.spacing(5)}
                    columns={[
                      {
                        field: 'id',
                        sortable: false,
                        filterable: false,
                        headerName: 'ID',
                        width: 50,
                        disableColumnMenu: true,
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
                    rows={permissions.map(({ id, name, description }) => ({
                      id,
                      name,
                      description,
                    }))}
                  />
                </div>
              </CardContent>
            </Collapse>
          </Grid>
        )
      })}
    </Grid>
  )
}
