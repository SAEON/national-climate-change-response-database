import Provider from './context'
import Grid from '@mui/material/Grid'
import Chart, {
  SPEND_BUDGET,
  FUNDING_SOURCE,
  OPERATIONAL_PROJECTS,
  OPERATIONAL_PROJECTS_BY_YEAR,
  PROJECT_COUNT,
  SECTOR_BUDGET,
  SECTOR_FUNDING,
} from './chart'
import Typography from '@mui/material/Typography'
import { styled, alpha } from '@mui/material/styles'

const StyledGrid = styled(Grid)({
  minHeight: 450,
})

export default () => {
  return (
    <Provider>
      <Typography
        sx={theme => ({
          textAlign: 'center',
          marginBottom: theme.spacing(1),
          color: alpha(theme.palette.common.black, 0.9),
        })}
        variant="h4"
      >
        Project status and summary
      </Typography>
      <Grid container spacing={3}>
        <Grid item container justifyContent={'center'}>
          <PROJECT_COUNT
            sx={{
              marginTop: theme => theme.spacing(4),
              padding: theme => theme.spacing(2),
              fontSize: '1.3rem',
            }}
          />
        </Grid>
        <StyledGrid item xs={12} md={6} container justifyContent="center">
          <Chart>{SPEND_BUDGET}</Chart>
        </StyledGrid>
        <StyledGrid item xs={12} md={6} container justifyContent="center">
          <Chart>{FUNDING_SOURCE}</Chart>
        </StyledGrid>
        <StyledGrid item xs={12} md={6} container justifyContent="center">
          <Chart>{OPERATIONAL_PROJECTS_BY_YEAR}</Chart>
        </StyledGrid>
        <StyledGrid item xs={12} md={6} container justifyContent="center">
          <Chart>{OPERATIONAL_PROJECTS}</Chart>
        </StyledGrid>
        <StyledGrid item xs={12} md={6} container justifyContent="center">
          <Chart>{SECTOR_BUDGET}</Chart>
        </StyledGrid>
        <StyledGrid item xs={12} md={6} container justifyContent="center">
          <Chart>{SECTOR_FUNDING}</Chart>
        </StyledGrid>
      </Grid>
    </Provider>
  )
}
