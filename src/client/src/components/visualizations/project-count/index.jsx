import { useMemo } from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import { alpha, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

const T = ({ sx = {}, ...props }) => (
  <Typography
    sx={{
      flexBasis: 0,
      flexGrow: 1,
      fontSize: '0.8rem',
      textAlign: 'center',
      ...sx,
    }}
    variant="overline"
    {...props}
  />
)

export default ({ data }) => {
  const theme = useTheme()
  const mdDown = useMediaQuery(theme.breakpoints.down('md'))
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
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
        display: 'flex',
        justifyContent: 'space-around',
        flexDirection: smDown ? 'column' : 'row',
      }}
      variant="outlined"
    >
      <T sx={smDown ? {} : { margin: theme => theme.spacing(2) }}>
        <b>{a}</b> Adaptation {mdDown ? '' : 'projects'}
      </T>
      <T sx={smDown ? {} : { margin: theme => theme.spacing(2) }}>
        <b>{m}</b> Mitigation {mdDown ? '' : 'projects'}
      </T>
      <T sx={smDown ? {} : { margin: theme => theme.spacing(2) }}>
        <b>{c}</b> Cross cutting {mdDown ? '' : 'projects'}
      </T>
    </Card>
  )
}
