import makeStyles from '@mui/styles/makeStyles'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import { Link, useLocation } from 'react-router-dom'
import MuiLink from '@mui/material/Link'
import EditIcon from 'mdi-react/EditIcon'
import SubmissionIcon from 'mdi-react/DatabaseAddIcon'

const useStyles = makeStyles(theme => ({
  link: {
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    marginRight: theme.spacing(0.5),
    width: 18,
    height: 18,
  },
}))

export default ({ contentBase = '/', routes }) => {
  const classes = useStyles()
  const { pathname } = useLocation() // Trigger re-render on location changes
  const normalizedPathname = pathname.replace(contentBase, '/')

  const tree = [...new Set(normalizedPathname.split('/'))].map(p => {
    return (
      routes.find(({ to }) => {
        if (!to) {
          return false
        }
        to = to.replace(contentBase, '').replace('/', '')
        return to === p
      }) || { label: p?.titleize() || '404 (Not found)' }
    )
  })

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {tree.length > 1 &&
        tree.slice(0, -1).map(({ label, Icon, BreadcrumbsIcon, breadcrumbsLabel, to }) => {
          Icon = BreadcrumbsIcon || Icon
          label = breadcrumbsLabel || label
          if (label === 'New') {
            Icon = SubmissionIcon
            return (
              <Typography key={label} color="inherit" className={classes.link}>
                {Icon && <Icon size={18} className={classes.icon} />}
                {label}
              </Typography>
            )
          }

          return (
            <MuiLink
              component={Link}
              key={label}
              color="inherit"
              to={
                to ||
                tree
                  .slice(1, -1)
                  .map(({ to, label }) => to || label)
                  .join('/')
              }
              className={classes.link}
            >
              {Icon && <Icon size={18} className={classes.icon} />}
              {label}
            </MuiLink>
          )
        })}

      {tree.slice(-1).map(({ label, breadcrumbsLabel, Icon, BreadcrumbsIcon } = {}) => {
        Icon = BreadcrumbsIcon || Icon
        label = breadcrumbsLabel || label

        if (label === 'Edit') {
          Icon = EditIcon
        }

        return (
          <Typography key={label} color="textPrimary" className={classes.link}>
            {Icon && <Icon size={18} className={classes.icon} />}
            {label}
          </Typography>
        )
      })}
    </Breadcrumbs>
  )
}
