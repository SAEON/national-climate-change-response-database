import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Contact from './_contact'
import Legal from './_legal'
import PageRoutes from './_page-routes'
import { Div } from '../html-tags'

export default ({ routes }) => {
  const _routes = routes.filter(({ includeInFooter }) => includeInFooter)

  return (
    <Div sx={{ position: 'relative' }}>
      <AppBar
        variant="outlined"
        elevation={0}
        position="relative"
        sx={{ backgroundColor: theme => theme.palette.grey[800] }}
      >
        {/* DISCLAIMERS */}
        <Toolbar sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <Container
            sx={theme => ({ paddingTop: theme.spacing(4), paddingBottom: theme.spacing(4) })}
          >
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
        <Toolbar
          variant="dense"
          sx={theme => ({ backgroundColor: theme.palette.grey[900], minHeight: theme.spacing(1) })}
        >
          <Container sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant="overline" variantMapping={{ overline: 'p' }}>
              © DFFE 2020 - {new Date().getFullYear()}
            </Typography>
          </Container>
        </Toolbar>
      </AppBar>
    </Div>
  )
}
