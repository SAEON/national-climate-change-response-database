import { useContext, useMemo } from 'react'
import { context as dataContext } from '../context'
import { Typography } from '@mui/material'
import Divider from '@mui/material/Divider'
import Fade from '@mui/material/Fade'
import { Span } from '../../../components/html-tags'

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
      fontSize: '1rem',
      fontWeight: 'bold',
      fontStyle: 'italic',
      marginRight: theme => theme.spacing(1),
      ...sx,
    }}
    {...props}
  ></Span>
)

export default () => {
  const { data } = useContext(dataContext)

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
    <Fade in={Boolean(_data)}>
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
        <D />
        <Typography variant="overline">
          <S sx={{ marginRight: 'unset' }} />
          project submissions
        </Typography>
      </Span>
    </Fade>
  )
}
