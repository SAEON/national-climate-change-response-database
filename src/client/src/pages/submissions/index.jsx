import { useContext } from 'react'
import { context as authContext } from '../../contexts/authorization'
import Filters from './filters'
import { useSnackbar } from 'notistack'
import Header from './header'
import Results from './results'
import Grid from '@mui/material/Grid'
import Hidden from '@mui/material/Hidden'
import Container from '@mui/material/Container'
import FilterContextProvider from './context'
import { Div } from '../../components/html-tags'

export default () => {
  const { hasPermission } = useContext(authContext)
  const { enqueueSnackbar } = useSnackbar()

  if (!hasPermission('validate-submission')) {
    enqueueSnackbar(
      `Please note: only VALIDATED submissions are shown on this page. If your submission is missing please contact the site administrator`,
      { variant: 'default' }
    )
  }

  return (
    <FilterContextProvider>
      <Header />
      <Div sx={{ marginTop: theme => theme.spacing(2) }} />
      <Container sx={{ minHeight: 1000 }}>
        <Grid container direction="row" spacing={2}>
          {/* FILTERS */}
          <Hidden mdDown>
            <Grid container item md={4} spacing={1}>
              <Grid xs item>
                <Filters />
              </Grid>
            </Grid>
          </Hidden>

          {/* RESULTS */}
          <Grid container direction="column" item xs style={{ flexGrow: 1 }} spacing={1}>
            <Grid item>
              <Results />
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Div sx={{ marginTop: theme => theme.spacing(2) }} />
    </FilterContextProvider>
  )
}
