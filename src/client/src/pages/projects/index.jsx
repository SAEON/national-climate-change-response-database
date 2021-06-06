import Filters from './filters'
import Header from './header'
import Results from './results'
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'
import Wrapper from '../../components/page-wrapper'
import FilterContextProvider from './context'

export default () => {
  return (
    <FilterContextProvider>
      <Header MobileFilters={Filters} />
      <Wrapper>
        <Grid container direction="row" spacing={2}>
          {/* FILTERS */}
          <Hidden smDown>
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
      </Wrapper>
    </FilterContextProvider>
  )
}
