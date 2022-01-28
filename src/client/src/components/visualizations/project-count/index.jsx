import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import { alpha } from '@mui/material/styles'

export default ({ data }) => {
  const a = data?.PROJECT_COUNT.data.find(({ intervention }) => intervention === 'Adaptation')
  const m = data?.PROJECT_COUNT.data.find(({ intervention }) => intervention === 'Mitigation')
  const c = data?.PROJECT_COUNT.data.find(({ intervention }) => intervention === 'Cross Cutting')

  return (
    <Card
      sx={{
        width: '100%',
        backgroundColor: theme => alpha(theme.palette.common.white, 1),
      }}
      variant="outlined"
    >
      <Typography
        sx={{
          fontSize: '0.8rem',
          display: 'block',
          textAlign: 'center',
          margin: theme => theme.spacing(2),
        }}
        variant="overline"
      >
        <b>{a?.total || '-'}</b> Adaptation projects | <b>{m?.total || '-'}</b> Mitigation projects
        | <b>{c?.total || '-'}</b> Cross cutting projects
      </Typography>
    </Card>
  )
}
