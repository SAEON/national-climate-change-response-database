import { useMemo } from 'react'
import { Typography } from '@mui/material'
import Divider from '@mui/material/Divider'
import Fade from '@mui/material/Fade'
import { Span } from '../../../components/html-tags'
import Hidden from '@mui/material/Hidden'

const D = props => (
  <Divider
    orientation="vertical"
    flexItem
    variant="middle"
    sx={{ mx: theme => theme.spacing(2) }}
    {...props}
  />
)

const S = ({ sx = {}, ...props }) => (
  <Span
    sx={{
      color: theme => theme.palette.primary.main,
      fontWeight: 'bold',
      fontStyle: 'italic',
      marginRight: theme => theme.spacing(1),
      ...sx,
    }}
    {...props}
  ></Span>
)

export default ({ PROJECT_COUNT }) => {
  const _data = useMemo(
    () =>
      PROJECT_COUNT?.data.reduce(
        (summary, { intervention, total }) => ({
          ...summary,
          [intervention.toUpperCase()]: (summary[intervention.toUpperCase()] || 0) + total,
        }),
        {}
      ),
    [PROJECT_COUNT?.data]
  )

  const a = useMemo(() => _data?.ADAPTATION || '-', [_data?.ADAPTATION])
  const m = useMemo(() => _data?.MITIGATION || '-', [_data?.MITIGATION])
  const c = useMemo(() => _data?.['CROSS CUTTING'] || '-', [_data])

  return (
    <Fade key="data-in" in={Boolean(_data)}>
      <Span sx={{ display: 'inline-flex' }}>
        <Typography variant="overline">
          <S>{a}</S> Adaptation
        </Typography>
        <D />
        <Typography variant="overline">
          <S>{m}</S> Mitigation
        </Typography>
        <D />
        <Typography variant="overline">
          <S>{c}</S> Cross cutting
        </Typography>
        <Hidden lgDown>
          <D />
          <Typography variant="overline">
            <S sx={{ marginRight: 'unset' }} />
            project submissions
          </Typography>
        </Hidden>
      </Span>
    </Fade>
  )
}
