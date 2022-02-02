import { useContext, useMemo } from 'react'
import { context as dataContext } from './context'
import { context as clientContext } from '../../contexts/client-context'
import { Div } from '../../components/html-tags'
import { Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'

const Caption = props => (
  <Typography
    variant="caption"
    sx={{ color: theme => alpha(theme.palette.common.white, 0.9), display: 'block' }}
    {...props}
  />
)

export default () => {
  const { data } = useContext(dataContext)
  const {
    region: { name: regionName },
  } = useContext(clientContext)

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
    <>
      <Div
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 99,
          ml: theme => theme.spacing(1),
          mt: theme => theme.spacing(0.5),
        }}
      >
        <Typography
          variant="overline"
          sx={{ color: theme => alpha(theme.palette.common.white, 0.9) }}
        >
          Project distribution ({regionName})
        </Typography>
        <Caption>Mitigation: {m}</Caption>
        <Caption>Adaptation: {a}</Caption>
        <Caption>Cross cutting: {c}</Caption>
      </Div>
    </>
  )
}
