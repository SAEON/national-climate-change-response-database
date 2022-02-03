import { useContext } from 'react'
import ChartDataProvider, { context as dataContext } from './context'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import ESTIMATED_BUDGET from '../../components/visualizations/spend-budget'
import FUNDING_SOURCE from '../../components/visualizations/funding-source'
import OPERATIONAL_PROJECTS_BY_YEAR from '../../components/visualizations/operational-projects-by-year'
import PROJECT_COUNT from '../../components/visualizations/project-count'
import PROJECT_COUNT_BAR from '../../components/visualizations/project-count-by-status'
import MITIGATION_SECTOR_BUDGET from '../../components/visualizations/sector-budget-mitigation'
import ADAPTATION_SECTOR_BUDGET from '../../components/visualizations/sector-budget-adaptation'
import { styled, alpha } from '@mui/material/styles'
import Card from '@mui/material/Card'
import Progress from '@mui/material/LinearProgress'
import { Div } from '../../components/html-tags'
import Heatmap from './heatmap'

const StyledGrid = styled(Grid)({
  minHeight: 450,
})

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: alpha(theme.palette.common.white, 1),
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  position: 'relative',
}))

export const ChartContainer = ({ children, ...props }) => (
  <StyledCard variant="outlined" {...props}>
    <Div sx={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>{children}</Div>
  </StyledCard>
)

const Layout = () => {
  const { loading, data } = useContext(dataContext)

  if (loading) {
    return (
      <div sx={{ height: '100vh' }}>
        <Progress sx={{ height: 6 }} />
      </div>
    )
  }

  return (
    <Container
      sx={{ paddingTop: theme => theme.spacing(3), paddingBottom: theme => theme.spacing(3) }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <PROJECT_COUNT data={data} />
        </Grid>
        {/* MAP */}
        <StyledGrid item xs={12} container justifyContent="center">
          <ChartContainer>
            <Heatmap />
          </ChartContainer>
        </StyledGrid>
        {/* CHART 1 */}
        <StyledGrid item xs={12} md={6} container justifyContent="center">
          <ChartContainer>
            <ESTIMATED_BUDGET data={data} />
          </ChartContainer>
        </StyledGrid>
        {/* CHART 2 */}
        <StyledGrid item xs={12} md={6} container justifyContent="center">
          <ChartContainer>
            <FUNDING_SOURCE data={data} />
          </ChartContainer>
        </StyledGrid>
        {/* CHART 3 */}
        <StyledGrid item xs={12} md={6} container justifyContent="center">
          <ChartContainer>
            <OPERATIONAL_PROJECTS_BY_YEAR data={data} />
          </ChartContainer>
        </StyledGrid>
        {/* CHART 4 */}
        <StyledGrid item xs={12} md={6} container justifyContent="center">
          <ChartContainer>
            <PROJECT_COUNT_BAR data={data} />
          </ChartContainer>
        </StyledGrid>
        {/* CHART 6 */}
        <StyledGrid item xs={12} md={6} container justifyContent="center">
          <ChartContainer>
            <MITIGATION_SECTOR_BUDGET data={data} />
          </ChartContainer>
        </StyledGrid>
        {/* CHART 7 */}
        <StyledGrid item xs={12} md={6} container justifyContent="center">
          <ChartContainer>
            <ADAPTATION_SECTOR_BUDGET data={data} />
          </ChartContainer>
        </StyledGrid>
      </Grid>
    </Container>
  )
}

export default () => {
  return (
    <ChartDataProvider>
      <Layout />
    </ChartDataProvider>
  )
}
