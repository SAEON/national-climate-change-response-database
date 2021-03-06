import GridItem_ from '../components/grid-item'
import BoxButton from '../../../components/fancy-buttons/box-button'
import ESTIMATED_BUDGET from '../../../components/visualizations/spend-budget'
import OPERATIONAL_PROJECTS_BY_YEAR from '../../../components/visualizations/operational-projects-by-year'
import { gql, useQuery } from '@apollo/client'
import { ChartContainer as CC } from '../../reports'
import { alpha } from '@mui/material/styles'
import Progress from '@mui/material/CircularProgress'
import { Div } from '../../../components/html-tags'
import Grid from '@mui/material/Grid'

const ChartContainer = props => (
  <CC
    sx={{
      backgroundColor: theme => alpha(theme.palette.common.white, 0.9),
      height: 300,
      width: '100%',
    }}
    {...props}
  />
)

const GridItem = props => <GridItem_ sm={12} md={4} {...props} />

export default () => {
  const { loading, data, error } = useQuery(
    gql`
      query ($ESTIMATED_BUDGET: Chart!, $OPERATIONAL_PROJECTS_BY_YEAR: Chart!) {
        ESTIMATED_BUDGET: chart(id: $ESTIMATED_BUDGET)
        OPERATIONAL_PROJECTS_BY_YEAR: chart(id: $OPERATIONAL_PROJECTS_BY_YEAR)
      }
    `,
    {
      fetchPolicy: 'no-cache',
      variables: {
        ESTIMATED_BUDGET: 'ESTIMATED_BUDGET',
        OPERATIONAL_PROJECTS_BY_YEAR: 'OPERATIONAL_PROJECTS_BY_YEAR',
      },
    }
  )

  if (loading) {
    return (
      <Grid container>
        <GridItem sx={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
          <Progress sx={{ color: theme => alpha(theme.palette.common.white, 0.5) }} size={48} />
        </GridItem>
      </Grid>
    )
  }

  if (error) {
    throw error
  }

  return (
    <Grid justifyContent="center" container spacing={6}>
      <GridItem>
        <ChartContainer>
          <ESTIMATED_BUDGET toolbox={{ show: false }} data={data} />
        </ChartContainer>
        <Div
          sx={theme => ({
            [theme.breakpoints.down('md')]: {
              marginBottom: theme.spacing(1),
            },
          })}
        />
      </GridItem>

      <GridItem>
        <ChartContainer>
          <OPERATIONAL_PROJECTS_BY_YEAR toolbox={{ show: false }} data={data} />
        </ChartContainer>
        <Div
          sx={theme => ({
            [theme.breakpoints.down('md')]: {
              marginBottom: theme.spacing(1),
            },
          })}
        />
      </GridItem>
      <GridItem>
        <BoxButton
          sx={{ boxShadow: 3, height: 300, width: '100%' }}
          to="/reports"
          title="... View charts"
        />
      </GridItem>
    </Grid>
  )
}
