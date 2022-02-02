import { useContext, useEffect, useState } from 'react'
import { context as clientContext } from '../../contexts/client-context'
import { Div } from '../../components/html-tags'
import MapProvider, { context as mapContext } from '../../components/ol-react'
import terrestrisBaseMap from '../../components/ol-react/layers/terrestris-base-map'
import osmBaseMap from '../../components/ol-react/layers/osm'
import stamenTonerBaseMap from '../../components/ol-react/layers/stamen-toner-map'
import heatMap from '../../components/visualizations/heat-map'
import { context as dataContext } from './context'
import { parse } from 'wkt'
import Button from '@mui/material/Button'
import { Typography, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'

const fadeLayer = ({ layer, start = 0, end = 1 }) => {
  if (start >= end) return
  const newOpacity = layer.get('opacity') + 0.05
  layer.set('opacity', newOpacity)
  setTimeout(() => fadeLayer({ layer, start: newOpacity, end }), 15)
}

const HeatMap = ({ zoom, blur, radius }) => {
  const [interventionType, setInterventionType] = useState(null)
  const { data } = useContext(dataContext)
  const { map } = useContext(mapContext)
  const theme = useTheme()
  const smDown = useMediaQuery(theme.breakpoints.down('sm'))

  useEffect(() => {
    let layer
    if (data) {
      layer = heatMap({
        data,
        opacity: 0,
        zoom,
        blur,
        radius,
        filter: ({ intervention }) => {
          if (interventionType === null) {
            return true
          }

          return intervention === interventionType
        },
      })
      map.addLayer(layer)
      fadeLayer({ layer })
    }

    return () => {
      map.removeLayer(layer)
    }
  }, [blur, data, interventionType, map, radius, zoom])

  return (
    <Div
      sx={{
        zIndex: 9,
        position: 'absolute',
        top: 0,
        right: 0,
        mr: theme => theme.spacing(1),
        mt: theme => theme.spacing(1),
        display: 'flex',
        flexDirection: smDown ? 'column' : 'row',
      }}
    >
      <Button
        sx={smDown ? {} : { mr: theme => theme.spacing(1) }}
        variant="contained"
        color={interventionType === null ? 'primary' : 'inherit'}
        size="small"
        onClick={() => setInterventionType(null)}
      >
        All
      </Button>
      <Button
        sx={smDown ? {} : { mr: theme => theme.spacing(1) }}
        variant="contained"
        color={interventionType === 'Adaptation' ? 'primary' : 'inherit'}
        size="small"
        onClick={() => setInterventionType('Adaptation')}
      >
        Adaptation
      </Button>
      <Button
        sx={smDown ? {} : { mr: theme => theme.spacing(1) }}
        variant="contained"
        color={interventionType === 'Mitigation' ? 'primary' : 'inherit'}
        size="small"
        onClick={() => setInterventionType('Mitigation')}
      >
        Mitigation
      </Button>
      <Button
        onClick={() => setInterventionType('Cross cutting')}
        variant="contained"
        color={interventionType === 'Cross cutting' ? 'primary' : 'inherit'}
        size="small"
      >
        Cross cutting
      </Button>
    </Div>
  )
}

export default () => {
  const {
    region: { centroid },
    isDefault: isDefaultTenant,
  } = useContext(clientContext)

  const [x, y] = parse(centroid).coordinates
  const zoom = (isDefaultTenant ? 6.5 : 7.5) - 1

  return (
    <Div sx={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0 }}>
      <MapProvider
        controls={[]}
        view={{
          zoom,
          center: [x, y],
        }}
        layers={[osmBaseMap({ id: 'OSM' })]}
      >
        <HeatMap zoom={zoom} blur={35} radius={12} />
        {/* <BaseLayerSwitcher /> */}
        <Div sx={{ position: 'absolute', bottom: 0, right: 0, zIndex: 10 }}>
          <Typography
            sx={{
              fontStyle: 'italic',
              mr: theme => theme.spacing(1),
              mb: theme => theme.spacing(0.5),
            }}
            variant="caption"
          >
            NOTE: National projects without explicit GPS coordinates are excluded
          </Typography>
        </Div>
      </MapProvider>
    </Div>
  )
}

/**
 * Not currently used
 * Adds a couple buttons to the map
 * to toggle between base layers
 */
// eslint-disable-next-line
const BaseLayerSwitcher = () => {
  const { map } = useContext(mapContext)
  const [baseLayer, setBaseLayer] = useState('OSM')

  useEffect(() => {
    const currentBase = map.getLayers().item(1)
    const currentBaseId = currentBase.get('id')
    if (currentBaseId !== baseLayer) {
      const layer =
        baseLayer === 'toner'
          ? stamenTonerBaseMap({ id: 'toner' })
          : baseLayer === 'OSM'
          ? osmBaseMap({ id: 'OSM' })
          : terrestrisBaseMap({ id: 'terrestris' })

      map.getLayers().insertAt(0, layer)
      map.getLayers().removeAt(1)
    }
  }, [baseLayer, map])

  return (
    <Div
      sx={{
        zIndex: 9,
        position: 'absolute',
        top: 0,
        left: 0,
        ml: theme => theme.spacing(1),
        mt: theme => theme.spacing(1),
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Button
        variant="contained"
        disableElevation
        color={baseLayer === 'OSM' ? 'primary' : 'inherit'}
        size="small"
        onClick={() => setBaseLayer('OSM')}
      >
        OSM
      </Button>
      <Button
        sx={{ mt: theme => theme.spacing(1) }}
        variant="contained"
        disableElevation
        color={baseLayer === 'toner' ? 'primary' : 'inherit'}
        size="small"
        onClick={() => setBaseLayer('toner')}
      >
        Toner
      </Button>
      <Button
        sx={{ mt: theme => theme.spacing(1) }}
        variant="contained"
        disableElevation
        color={baseLayer === 'terrestris' ? 'primary' : 'inherit'}
        size="small"
        onClick={() => setBaseLayer('terrestris')}
      >
        Elevation
      </Button>
    </Div>
  )
}
