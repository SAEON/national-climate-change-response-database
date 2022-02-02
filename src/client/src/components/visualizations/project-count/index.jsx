import { useMemo } from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import { alpha } from '@mui/material/styles'

export default ({ data }) => {
  const _data = useMemo(
    () =>
      data?.PROJECT_COUNT.data.reduce(
        (summary, { intervention, total }) => ({
          ...summary,
          [intervention.toUpperCase()]: (summary[intervention.toUpperCase()] || 0) + total,
        }),
        {}
      ),
    [data?.PROJECT_COUNT.data]
  )

  const a = useMemo(() => _data?.ADAPTATION || '-', [_data?.ADAPTATION])
  const m = useMemo(() => _data?.MITIGATION || '-', [_data?.MITIGATION])
  const c = useMemo(() => _data?.['CROSS CUTTING'] || '-', [_data])

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
        <b>{a}</b> Adaptation projects | <b>{m}</b> Mitigation projects | <b>{c}</b> Cross cutting
        projects
      </Typography>
    </Card>
  )
}
