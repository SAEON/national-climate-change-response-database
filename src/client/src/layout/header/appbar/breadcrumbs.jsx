import { makeStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import { Link, useLocation } from 'react-router-dom'
import MuiLink from '@material-ui/core/Link'
import navItems from './nav-items'
import EditIcon from 'mdi-react/EditIcon'

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
    return (
      navItems.find(({ to }) => {
        to = to.replace('/', '')
        return to === p
      }) || { label: p?.titleize() || '404 (Not found)' }
    )
  })

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {tree.length > 1 &&
        tree.slice(0, -1).map(({ label, Icon, to }) => {
          return (
            <MuiLink component={Link} key={label} color="inherit" to={to} className={classes.link}>
              {Icon && <Icon className={classes.icon} />}
              {label}
            </MuiLink>
          )
        })}

      {tree.slice(-1).map(({ label, Icon } = {}) => {
        if (label === 'Edit') {
          Icon = EditIcon
        }
        return (
          <Typography key={label} color="textPrimary" className={classes.link}>
            {Icon && <Icon className={classes.icon} />}
            {label}
          </Typography>
        )
      })}
    </Breadcrumbs>
  )
}
