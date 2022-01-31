import { useContext, useEffect } from 'react'
import { context as clientContext } from '../../contexts/client-context'
import ChartDataProvider, { context as dataContext } from './context'
import MapProvider, { context as mapContext } from '../../components/ol-react'
import baseLayer from '../../components/ol-react/layers/terrestris-base-map'
import Container from '@mui/material/Container'
import { alpha } from '@mui/material/styles'
import heatMap from '../../components/visualizations/heat-map'
import Header from './header'
import { Div } from '../../components/html-tags'
import BoxButton from '../../components/fancy-buttons/box-button'
import { parse } from 'wkt'
import Fade from '@mui/material/Fade'

const fadeLayer = async (layer, start, end) => {
  if (start <= end) {
    const newOpacity = layer.get('opacity') + 0.05
    layer.set('opacity', newOpacity)
    await new Promise(res => setTimeout(res, 10))
    fadeLayer(layer, newOpacity, end)
  }
}

const bg3 = { backgroundColor: theme => alpha(theme.palette.common.black, 0.4) }

const HeatMap = () => {
  const { data } = useContext(dataContext)
  const { map } = useContext(mapContext)

  useEffect(() => {
    let layer
    if (data) {
      layer = heatMap({ data, opacity: 0 })
      map.addLayer(layer)
      fadeLayer(layer, 0, 1)
    }

    return () => {
      map.removeLayer(layer)
    }
  }, [data, map])

  return null
}

export default () => {
  const {
    region: { name: regionName, centroid },
    isDefault: isDefaultTenant,
  } = useContext(clientContext)

  const [x, y] = parse(centroid).coordinates

  return (
    <ChartDataProvider>
      <Header />
      {/* MAP */}
      <Div sx={{ height: 'calc(100vh - 220px)', with: '100%', position: 'relative' }}>
        <Div sx={{ position: 'absolute', zIndex: 100, left: 0, right: 0, top: 0, bottom: 0 }}>
          <Div sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Container>
              <Div sx={{ height: 100 }}>
                <BoxButton title={`Explore ${regionName} climate change response projects`} />
              </Div>
            </Container>
          </Div>
        </Div>
        <Fade timeout={2000} key="map" in={true}>
          <Div
            sx={{
              height: '100%',
              width: '100%',
              position: 'absolute',
              zIndex: 99,
              opacity: 1,
              backgroundColor: theme => alpha(theme.palette.common.black, 0.4),
              backgroundImage: theme =>
                `linear-gradient(${alpha(
                  theme.palette.primary.main,
                  0.1
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
        </MapProvider>
      </Div>

      {/* HOME PAGE CONTENT */}
      <Div sx={bg3}>
        <Container
          sx={{ paddingTop: theme => theme.spacing(3), paddingBottom: theme => theme.spacing(3) }}
        >
          4 boxes - link to about, charts, submit, and search each with a little blurb
        </Container>
      </Div>
    </ChartDataProvider>
  )
}
