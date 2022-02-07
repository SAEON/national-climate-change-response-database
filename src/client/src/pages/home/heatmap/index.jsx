import { useContext, useMemo } from 'react'
import { context as clientContext } from '../../../contexts/client-context'
import { context as layoutContext } from '../../../contexts/layout'
import MapProvider from '../../../components/ol-react'
import baseLayer from '../../../components/ol-react/layers/terrestris-base-map'
import Fade from '@mui/material/Fade'
import { parse } from 'wkt'
import { Div } from '../../../components/html-tags'
import { alpha } from '@mui/material/styles'
import HeatMap from './_data-layer'

export default ({ children, toolbarRef }) => {
  const { headerRef } = useContext(layoutContext)
  const {
    region: { centroid },
    isDefault: isDefaultTenant,
  } = useContext(clientContext)

  const [x, y] = parse(centroid).coordinates
  const zoom = isDefaultTenant ? 6.5 : 7.5

  const offsetHeight = useMemo(
    () => (headerRef?.offsetHeight || 0) + (toolbarRef?.offsetHeight || 0),
    [headerRef, toolbarRef]
  )

  // if (!headerRef || !toolbarRef) {
  //   return null
  // }

  return (
    <Div sx={{ height: `calc(100vh - ${offsetHeight}px)`, width: '100%', position: 'relative' }}>
      <Fade timeout={2000} key="map" in={true}>
        <Div
          sx={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            zIndex: 7,
            opacity: 1,
            backgroundColor: theme => alpha(theme.palette.common.black, 0.3),
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
          zoom,
          center: [x, y],
        }}
        interactions={[]}
        controls={[]}
        layers={[baseLayer()]}
      >
        <HeatMap zoom={zoom}>{children}</HeatMap>
      </MapProvider>
    </Div>
  )
}
