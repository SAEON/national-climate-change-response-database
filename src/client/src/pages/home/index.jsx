import { useContext } from 'react'
import { context as clientContext } from '../../contexts/client-context'
import ChartDataProvider, { context as dataContext } from './context'
import MapProvider from '../../components/ol-react'
import baseLayer from '../../components/ol-react/layers/terrestris-base-map'
import Container from '@mui/material/Container'
import { alpha } from '@mui/material/styles'
import HeatMap from '../../components/visualizations/heat-map'
import Header from './header'
import { Div } from '../../components/html-tags'
import BoxButton from '../../components/fancy-buttons/box-button'
import { parse } from 'wkt'

const bg3 = { backgroundColor: theme => alpha(theme.palette.common.black, 0.4) }

const MapData = () => {
  const { data } = useContext(dataContext)
  return <HeatMap data={data} />
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
      <Div sx={{ height: 'calc(100vh - 220px)', with: '100%', position: 'relative' }}>
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
        <MapProvider
          view={{
            zoom: isDefaultTenant ? 6.5 : 7.5,
            center: [x, y],
          }}
          interactions={[]}
          controls={[]}
          baseLayer={[baseLayer()]}
        >
          <MapData />
          <Div sx={{ position: 'absolute', zIndex: 100, left: 0, right: 0, top: 0, bottom: 0 }}>
            <Div sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
              <Container>
                <Div sx={{ height: 100 }}>
                  <BoxButton title={`Explore ${regionName} climate change response projects`} />
                </Div>
              </Container>
            </Div>
          </Div>
        </MapProvider>
      </Div>

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
