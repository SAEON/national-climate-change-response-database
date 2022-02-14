import { useContext, useEffect } from 'react'
import heatMap from '../../../components/visualizations/heat-map'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import { context as dataContext } from '../context'
import { context as mapContext } from '../../../components/ol-react'
import { context as clientContext } from '../../../contexts/client-context'
import Hidden from '@mui/material/Hidden'
import Fade from '@mui/material/Fade'

const fadeLayer = ({ layer, start = 0, end = 1 }) => {
  if (start >= end) return
  const newOpacity = layer.get('opacity') + 0.05
  layer.set('opacity', newOpacity)
  setTimeout(() => fadeLayer({ layer, start: newOpacity, end }), 15)
}

export default ({ zoom }) => {
  const { data } = useContext(dataContext)
  const { map } = useContext(mapContext)

  const {
    region: { geometry },
  } = useContext(clientContext)

  useEffect(() => {
    if (data) {
      // If a heatmap layer already exists remove it
      map.getLayers().forEach(l => {
        if (l.get('id') === 'heatmap') {
          map.removeLayer(l)
        }
      })

      // Add a heatmap layer
      const layer = heatMap({
        id: 'heatmap',
        data,
        opacity: 0,
        zoom,
      })
      map.addLayer(layer)
      fadeLayer({ layer, end: 0.8 })
    }
  }, [data, geometry, map, zoom])

  return (
    <Hidden mdDown>
      <Fade key="map-caption" in={Boolean(data)}>
        <Typography
          variant="caption"
          sx={{
            zIndex: 11,
            fontStyle: 'italic',
            color: theme => alpha(theme.palette.common.white, 0.9),
            position: 'absolute',
            right: 0,
            top: 0,
            mr: theme => theme.spacing(1),
            mt: theme => theme.spacing(0.5),
          }}
        >
          Project location distribution excl. national projects (background)
        </Typography>
      </Fade>
    </Hidden>
  )
}
