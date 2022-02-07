import { useContext, useEffect, useState } from 'react'
import heatMap from '../../../components/visualizations/heat-map'
import useMediaQuery from '@mui/material/useMediaQuery'
import Typography from '@mui/material/Typography'
import { alpha, useTheme } from '@mui/material/styles'
import { context as dataContext } from '../context'
import { context as mapContext } from '../../../components/ol-react'
import { context as clientContext } from '../../../contexts/client-context'
import Buttons from './_buttons'

const fadeLayer = ({ layer, start = 0, end = 1 }) => {
  if (start >= end) return
  const newOpacity = layer.get('opacity') + 0.05
  layer.set('opacity', newOpacity)
  setTimeout(() => fadeLayer({ layer, start: newOpacity, end }), 15)
}

export default ({ children, zoom }) => {
  const [interventionType, setInterventionType] = useState(null)
  const { data } = useContext(dataContext)
  const { map } = useContext(mapContext)
  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))
  const {
    region: { geometry },
    _clientRoutes: routes,
  } = useContext(clientContext)

  useEffect(() => {
    let layer
    if (data) {
      layer = heatMap({
        data,
        opacity: 0,
        zoom,
        filter: ({ intervention }) => {
          if (interventionType === null) {
            return true
          } else {
            return intervention === interventionType
          }
        },
      })
      map.addLayer(layer)
      fadeLayer({ layer, end: 0.8 })
    }

    return () => {
      map.removeLayer(layer)
    }
  }, [data, geometry, interventionType, map, zoom])

  return (
    <>
      <Buttons
        routes={routes}
        interventionType={interventionType}
        setInterventionType={setInterventionType}
      />
      <Typography
        variant="caption"
        sx={{
          zIndex: 11,
          fontStyle: 'italic',
          color: theme => alpha(theme.palette.common.white, 0.9),
          position: 'absolute',
          right: 0,
          [smDown ? 'top' : 'bottom']: 0,
          mr: theme => theme.spacing(1),
          mb: theme => theme.spacing(0.5),
        }}
      >
        Project location distribution (excluding national projects)
      </Typography>
      {children}
    </>
  )
}