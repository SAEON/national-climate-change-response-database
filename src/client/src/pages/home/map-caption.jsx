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

  const summary = useMemo(
    () =>
      data?.PROJECT_COUNT.data.reduce(
        (summary, { intervention, total }) => ({ ...summary, [intervention]: total }),
        { Adaptation: 0, Mitigation: 0, 'Cross Cutting': 0 }
      ),
    [data?.PROJECT_COUNT.data]
  )

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
        <Caption>Mitigation: {summary?.Mitigation || '-'}</Caption>
        <Caption>Adaptation: {summary?.Adaptation || '-'}</Caption>
        <Caption>Cross cutting: {summary?.['Cross Cutting'] || '-'}</Caption>
      </Div>
    </>
  )
}
