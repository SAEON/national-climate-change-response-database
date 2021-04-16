import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import { Link, useLocation } from 'react-router-dom'
import MuiLink from '@material-ui/core/Link'
import HomeIcon from 'mdi-react/HomeIcon'
import WhatshotIcon from 'mdi-react/HomeIcon'
import GrainIcon from 'mdi-react/HomeIcon'
import navItems from './nav-items'

const useStyles = makeStyles(theme => ({
  link: {
    display: 'flex',
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 20,
    height: 20,
  },
}))

export default function IconBreadcrumbs() {
  const classes = useStyles()
  const { pathname } = useLocation() // Trigger re-render on location changes
  const tree = [...new Set(pathname.split('/'))].map(p => {
    const navItem = navItems.find(({ to }) => {
      to = to.replace('/', '')
      return to === p
    })
    return navItem
  })

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {tree.length > 1 &&
        tree.slice(0, -1).map(({ label, Icon, to }) => {
          return (
            <MuiLink component={Link} key={label} color="inherit" to={to} className={classes.link}>
              <Icon className={classes.icon} />
              {label}
            </MuiLink>
          )
        })}

      {tree.slice(-1).map(({ label, Icon }) => {
        return (
          <Typography key={label} color="textPrimary" className={classes.link}>
            <Icon className={classes.icon} />
            {label}
          </Typography>
        )
      })}
    </Breadcrumbs>
  )
}
