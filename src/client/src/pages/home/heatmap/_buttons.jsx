import Button from '@mui/material/Button'
import Hidden from '@mui/material/Hidden'
import { Div } from '../../../components/html-tags'
import { Link } from 'react-router-dom'

export default ({ routes, interventionType, setInterventionType }) => {
  const ReportsIcon = routes.find(({ to }) => to === '/reports').Icon

  return (
    <Hidden smDown>
      <Div
        sx={{
          zIndex: 9,
          position: 'absolute',
          top: 0,
          right: 0,
          display: 'flex',
          mr: theme => theme.spacing(1),
          mt: theme => theme.spacing(1),
        }}
      >
        <Button
          sx={{ mr: theme => theme.spacing(1) }}
          variant="contained"
          disableElevation
          color={interventionType === null ? 'primary' : 'inherit'}
          size="small"
          onClick={() => setInterventionType(null)}
        >
          All
        </Button>
        <Button
          sx={{ mr: theme => theme.spacing(1) }}
          variant="contained"
          disableElevation
          color={interventionType === 'Adaptation' ? 'primary' : 'inherit'}
          size="small"
          onClick={() => setInterventionType('Adaptation')}
        >
          Adaptation
        </Button>
        <Button
          sx={{ mr: theme => theme.spacing(1) }}
          variant="contained"
          disableElevation
          color={interventionType === 'Mitigation' ? 'primary' : 'inherit'}
          size="small"
          onClick={() => setInterventionType('Mitigation')}
        >
          Mitigation
        </Button>
        <Button
          sx={{ mr: theme => theme.spacing(1) }}
          onClick={() => setInterventionType('Cross cutting')}
          variant="contained"
          disableElevation
          color={interventionType === 'Cross cutting' ? 'primary' : 'inherit'}
          size="small"
        >
          Crosscutting
        </Button>
        <Button
          disableElevation
          component={Link}
          sx={{ ml: theme => theme.spacing(1) }}
          variant="contained"
          to={'/reports'}
          color={'inherit'}
          size="small"
          startIcon={<ReportsIcon size={18} />}
        >
          Explore
        </Button>
      </Div>
    </Hidden>
  )
}
