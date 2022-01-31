import { alpha } from '@mui/material/styles'
import { useContext, useEffect } from 'react'
import { context as clientContext } from '../../contexts/client-context'
import MapProvider, { context as mapContext } from '../../components/ol-react'
import baseLayer from '../../components/ol-react/layers/terrestris-base-map'
import { context as dataContext } from './context'
import heatMap from '../../components/visualizations/heat-map'
import Fade from '@mui/material/Fade'
import { parse } from 'wkt'
import { Div } from '../../components/html-tags'
import ScrollButton from '../../components/fancy-buttons/scroll-button'

const fadeLayer = (layer, start = 0, end = 1) => {
  if (start >= end) return
  const newOpacity = layer.get('opacity') + 0.05
  layer.set('opacity', newOpacity)
  setTimeout(() => fadeLayer(layer, newOpacity, end), 15)
}

const HeatMap = () => {
  const { data } = useContext(dataContext)
  const { map } = useContext(mapContext)

  useEffect(() => {
    let layer
    if (data) {
      layer = heatMap({ data, opacity: 0 })
      map.addLayer(layer)
      fadeLayer(layer)
    }

    return () => {
      map.removeLayer(layer)
    }
  }, [data, map])

  return null
}

export default ({ children, contentRef }) => {
  const {
    region: { centroid },
    isDefault: isDefaultTenant,
  } = useContext(clientContext)

  const [x, y] = parse(centroid).coordinates
  return (
    <Div sx={{ height: 'calc(100vh - 220px)', with: '100%', position: 'relative' }}>
      {children}
      <Fade timeout={2000} key="map" in={true}>
        <Div
          sx={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            zIndex: 99,
            opacity: 1,
            backgroundColor: theme => alpha(theme.palette.common.black, 0.2),
            backgroundImage: theme =>
              `linear-gradient(${alpha(
                theme.palette.primary.main,
                0.05
              )} 0.7000000000000001px, transparent 0.7000000000000001px)`,
            backgroundSize: '10px 10px',
          }}
        />
      </Fade>

      <MapProvider
        view={{
          zoom: isDefaultTenant ? 6.5 : 7.5,
          center: [x, y],
        }}
        interactions={[]}
        controls={[]}
        layers={[baseLayer()]}
      >
        <HeatMap />
        <ScrollButton
          onClick={() =>
            window.scrollTo({ top: contentRef.current.offsetTop, left: 0, behavior: 'smooth' })
          }
          sx={{ bottom: 96, position: 'relative', zIndex: 101 }}
        />
      </MapProvider>
    </Div>
  )
}
