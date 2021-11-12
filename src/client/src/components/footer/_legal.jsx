import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'

export default ({ routes }) => {
  const theme = useTheme()

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">Legal</Typography>
      </Grid>
      <Grid container item xs={12}>
        {routes
          .filter(({ group }) => group === 'legal')
          .map(({ label, Icon, to }) => (
            <Grid item xs={12} key={label}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Icon size={18} />
                <Typography
                  component={({ style, ...otherProps }) => (
                    <Link
                      {...otherProps}
                      style={Object.assign(
                        { ...style },
                        { color: 'white', marginLeft: theme.spacing(1) }
                      )}
                      to={to}
                      component={RouterLink}
                      key={label}
                    >
                      {label}
                    </Link>
                  )}
                  variant="overline"
                >
                  {label}
                </Typography>
              </div>
            </Grid>
          ))}
      </Grid>
    </Grid>
  )
}
