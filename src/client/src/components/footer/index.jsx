import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import { useTheme } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Contact from './_contact'
import Legal from './_legal'
import PageRoutes from './_page-routes'

export default ({ routes }) => {
  const theme = useTheme()

  const _routes = routes.filter(({ includeInFooter }) => includeInFooter)

  return (
    <div style={{ position: 'relative' }}>
      <AppBar
        variant="outlined"
        elevation={0}
        position="relative"
        style={{ backgroundColor: theme.palette.grey[800] }}
      >
        {/* DISCLAIMERS */}
        <Toolbar style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Container style={{ paddingTop: theme.spacing(4), paddingBottom: theme.spacing(4) }}>
            <Grid container spacing={4}>
              <Grid container item xs={12} sm={4}>
                <PageRoutes routes={_routes} />
              </Grid>
              <Grid container item xs={12} sm={4}>
                <Legal routes={_routes} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <Contact />
              </Grid>
            </Grid>
          </Container>
        </Toolbar>

        {/* COPYRIGHT */}
        <Toolbar style={{ backgroundColor: theme.palette.grey[900], minHeight: theme.spacing(1) }}>
          <Container style={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="overline" variantMapping={{ overline: 'p' }}>
              © DFFE 2020 - {new Date().getFullYear()}
            </Typography>
          </Container>
        </Toolbar>
      </AppBar>
    </div>
  )
}
