import { useContext } from 'react'
import { context as authContext } from '../../../contexts/authorization'
import { context as accessContext } from '../context'
import CardContent from '@material-ui/core/CardContent'
import useTheme from '@material-ui/core/styles/useTheme'
import Grid from '@material-ui/core/Grid'
import { DataGrid } from '@material-ui/data-grid'
import Collapse from '../../../components/collapse'

export default ({ access }) => {
  const theme = useTheme()
  const { hasRole } = useContext(authContext)
  const { roles } = useContext(accessContext)
  if (!hasRole(access)) {
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
              <CardContent style={{ padding: 0 }}>
                <div style={{ height: 400 }}>
                  <DataGrid
                    pageSize={25}
                    rowHeight={theme.spacing(5)}
                    columns={[
                      { field: 'id', headerName: 'ID', width: 90 },
                      { field: 'name', headerName: 'Name', width: 200 },
                      { field: 'description', headerName: 'Description', width: 550 },
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
