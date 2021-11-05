import Toolbar_ from './toolbar'
import Authentication from './authentication'
import NavigationMenu from './navigation-menu'
import { useTheme } from '@mui/material/styles'
import Hidden from '@mui/material/Hidden'
import Divider from '@mui/material/Divider'
import Breadcrumbs from './breadcrumbs'

export const Toolbar = Toolbar_

export default ({ contentBase, routes, disableBreadcrumbs, ...props }) => {
  const theme = useTheme()

  return (
    <Toolbar_ {...props}>
      {/* NAVIGATION MENU */}
      <div style={{ marginLeft: theme.spacing(1) }} />
      <NavigationMenu routes={routes} />
      <Hidden smDown>
        <Divider
          flexItem
          orientation="vertical"
          style={{ marginLeft: theme.spacing(1), marginRight: theme.spacing(2) }}
        />
      </Hidden>

      <Hidden mdDown>
        {!disableBreadcrumbs && <Breadcrumbs contentBase={contentBase} routes={routes} />}
      </Hidden>

      <div style={{ marginLeft: 'auto' }} />

      <Authentication />
    </Toolbar_>
  )
}
