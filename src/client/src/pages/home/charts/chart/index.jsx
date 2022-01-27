import { useContext } from 'react'
import { context as dataContext } from '../context'
import CircularProgress from '@mui/material/CircularProgress'
import { Div } from '../../../../components/html-tags'
import { styled, alpha } from '@mui/material/styles'
import Card from '@mui/material/Card'

export { default as SPEND_BUDGET } from './spend-budget'
export { default as FUNDING_SOURCE } from './funding-source'
export { default as OPERATIONAL_PROJECTS } from './operational-projects'
export { default as OPERATIONAL_PROJECTS_BY_YEAR } from './operational-projects-by-year'
export { default as PROJECT_COUNT } from './project-count'
export { default as SECTOR_BUDGET } from './sector-budget'
export { default as SECTOR_FUNDING } from './sector-funding'

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  height: '100%',
  backgroundColor: alpha(theme.palette.common.white, 1),
  justifyContent: 'center',
  alignItems: 'center',
  display: 'flex',
  position: 'relative',
}))

export default ({ children: Children }) => {
  const { loading, data } = useContext(dataContext)

  if (loading) {
    return (
      <StyledCard>
        <CircularProgress />
      </StyledCard>
    )
  }

  return (
    <StyledCard variant="outlined">
      <Div sx={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}>
        <Children data={data} />
      </Div>
    </StyledCard>
  )
}
