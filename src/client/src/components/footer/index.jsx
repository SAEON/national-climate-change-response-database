import { useContext } from 'react'
import { context as clientContext } from '../../contexts/client-context'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Contact from './_contact'
import Legal from './_legal'
import SourceCode from './_source-code'
import PageRoutes from './_page-routes'
import { Div } from '../html-tags'

export default () => {
  const _routes = useContext(clientContext)._clientRoutes.filter(
    ({ includeInFooter }) => includeInFooter
  )

  return (
    <Div sx={{ position: 'relative' }}>
      <AppBar
        variant="outlined"
        elevation={0}
        position="relative"
        sx={{ backgroundColor: theme => theme.palette.grey[800] }}
      >
        {/* MAIN */}
        <Toolbar
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Container
            sx={theme => ({ paddingTop: theme.spacing(4), paddingBottom: theme.spacing(4) })}
          >
            <Grid container spacing={4}>
              <Grid container item xs={12} sm={3}>
                <PageRoutes routes={_routes} />
              </Grid>
              <Grid container item xs={12} sm={3}>
                <Legal routes={_routes} />
              </Grid>
              <Grid item xs={12} sm={3}>
                <Contact />
              </Grid>
              <Grid container item xs={12} sm={3}>
                <SourceCode routes={_routes} />
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
