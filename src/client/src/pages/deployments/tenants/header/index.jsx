import NewTenant from './new-tenant'
import DeleteTenants from './delete-tenants'
import useTheme from '@mui/material/styles/useTheme'

export default () => {
  const theme = useTheme()

  return (
    <>
      <DeleteTenants />
      <div style={{ marginRight: theme.spacing(1) }} />
      <NewTenant />
    </>
  )
}
