import { useContext } from 'react'
import ChartDataProvider, { context as dataContext } from './context'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import SPEND_BUDGET from '../../components/visualizations/spend-budget'
import FUNDING_SOURCE from '../../components/visualizations/funding-source'
import OPERATIONAL_PROJECTS from '../../components/visualizations/operational-projects'
import OPERATIONAL_PROJECTS_BY_YEAR from '../../components/visualizations/operational-projects-by-year'
import PROJECT_COUNT from '../../components/visualizations/project-count'
import SECTOR_BUDGET from '../../components/visualizations/sector-budget'
import SECTOR_FUNDING from '../../components/visualizations/sector-funding'
import { styled, alpha } from '@mui/material/styles'
import Card from '@mui/material/Card'
import Progress from '@mui/material/LinearProgress'
import { Div } from '../../components/html-tags'

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

const ChartContainer = ({ children }) => (
  <StyledCard variant="outlined">
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
        <StyledGrid item xs={12} md={6} container justifyContent="center">
          <ChartContainer>
            <SPEND_BUDGET data={data} />
          </ChartContainer>
        </StyledGrid>
        <StyledGrid item xs={12} md={6} container justifyContent="center">
          <ChartContainer>
            <FUNDING_SOURCE data={data} />
          </ChartContainer>
        </StyledGrid>
        <StyledGrid item xs={12} md={6} container justifyContent="center">
          <ChartContainer>
            <OPERATIONAL_PROJECTS_BY_YEAR data={data} />
          </ChartContainer>
        </StyledGrid>
        <StyledGrid item xs={12} md={6} container justifyContent="center">
          <ChartContainer>
            <OPERATIONAL_PROJECTS data={data} />
          </ChartContainer>
        </StyledGrid>
        <StyledGrid item xs={12} md={6} container justifyContent="center">
          <ChartContainer>
            <SECTOR_BUDGET data={data} />
          </ChartContainer>
        </StyledGrid>
        <StyledGrid item xs={12} md={6} container justifyContent="center">
          <ChartContainer>
            <SECTOR_FUNDING data={data} />
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
