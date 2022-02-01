import { useContext, useEffect, useState } from 'react'
import { context as clientContext } from '../../contexts/client-context'
import { Div } from '../../components/html-tags'
import MapProvider, { context as mapContext } from '../../components/ol-react'
import baseLayer from '../../components/ol-react/layers/terrestris-base-map'
import heatMap from '../../components/visualizations/heat-map'
import { context as dataContext } from './context'
import { parse } from 'wkt'
import Button from '@mui/material/Button'

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
        zIndex: 1500,
        position: 'absolute',
        top: 0,
        right: 0,
        mr: theme => theme.spacing(1),
        mt: theme => theme.spacing(1),
      }}
    >
      <Button
        sx={{ mr: theme => theme.spacing(1) }}
        variant="contained"
        disableElevation
        color={interventionType === null ? 'primary' : 'inherit'}
        size="small"
        onClick={() => setInterventionType(null)}
      >
        All
      </Button>
      <Button
        sx={{ mr: theme => theme.spacing(1) }}
        variant="contained"
        disableElevation
        color={interventionType === 'Adaptation' ? 'primary' : 'inherit'}
        size="small"
        onClick={() => setInterventionType('Adaptation')}
      >
        Adaptation
      </Button>
      <Button
        sx={{ mr: theme => theme.spacing(1) }}
        variant="contained"
        disableElevation
        color={interventionType === 'Mitigation' ? 'primary' : 'inherit'}
        size="small"
        onClick={() => setInterventionType('Mitigation')}
      >
        Mitigation
      </Button>
      <Button
        onClick={() => setInterventionType('Cross cutting')}
        variant="contained"
        disableElevation
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
        view={{
          zoom,
          center: [x, y],
        }}
        layers={[baseLayer()]}
      >
        <HeatMap zoom={zoom} blur={15} radius={8} />
      </MapProvider>
    </Div>
  )
}
