import { useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { context as mapContext } from '../../../../../ol-react'
import VectorSource from 'ol/source/Vector'
import { useSnackbar } from 'notistack'
import VectorLayer from 'ol/layer/Vector'
import Draw from 'ol/interaction/Draw'
import LayerGroup from 'ol/layer/Group'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import WKT from 'ol/format/WKT'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'
import Link from '@mui/material/Link'

// eslint-disable-next-line
export default ({ geofencePolygons = [], points = [], setPoints }) => {
  const _wkt = useMemo(() => new WKT(), [])

  const { enqueueSnackbar } = useSnackbar()
  const { map } = useContext(mapContext)
  const source = useMemo(() => new VectorSource({ wrapX: false }), [])
  const awaitGeometryFunction = useRef(null)

  const fences = useMemo(() => {
    return geofencePolygons.map(fence => {
      return _wkt.readGeometry(fence.geometry, {
        dataProjection: 'EPSG:4326',
        featureProjection: 'EPSG:4326',
      })
    })
  }, [_wkt, geofencePolygons])

  const drawInteraction = useMemo(
    () =>
      new Draw({
        type: 'Point',
        source,
        geometryFunction: ([y, x]) => {
          awaitGeometryFunction.current = new Promise(resolve => {
            if (fences.length) {
              let isValid = false
              fences.forEach(fence => {
                if (fence.intersectsCoordinate([y, x])) {
                  isValid = true
                }
              })
              if (!isValid) {
                enqueueSnackbar(
                  'Point input is not within bounds of the selected project region(s). This is likely an error and should be corrected',
                  {
                    variant: 'warning',
                  }
                )
              }
            }
            resolve()
          })
          setPoints([...points, [y, x]])
        },
      }),
    [source, setPoints, points, fences, enqueueSnackbar]
  )

  const mouseenter = useCallback(() => {
    let added = false
    map
      .getInteractions()
      .getArray()
      .forEach(interaction => {
        if (interaction.constructor === Draw) {
          added = true
        }
      })
    if (!added) {
      map.addInteraction(drawInteraction)
    }
  }, [drawInteraction, map])

  const mouseleave = useCallback(() => {
    map
      .getInteractions()
      .getArray()
      .forEach(interaction => {
        if (interaction.constructor === Draw) {
          map.removeInteraction(interaction)
        }
      })
  }, [map])

  /**
   * Points
   * ======
   * Syncs points stored in the
   * form with points on the map.
   *
   * Also make sure that existing
   * points are constrained to a
   * bounding box.
   */
  useEffect(() => {
    source.clear()

    if (points.length !== points.length) {
      setPoints(points)
    }

    source.addFeatures(
      points.map(
        point =>
          new Feature({
            geometry: new Point(point),
          })
      )
    )
  }, [points, setPoints, source, map])

  /**
   * Layer
   * =====
   * Add a layer on component mount
   * Remove the layer on dismount
   */
  useEffect(() => {
    map.setLayerGroup(
      new LayerGroup({
        layers: [
          ...map.getLayerGroup().getLayers().getArray(),
          new VectorLayer({
            id: `xy-points`,
            title: 'XY points',
            source,
          }),
        ],
      })
    )

    return () => {
      map.setLayerGroup(
        new LayerGroup({
          layers: map
            .getLayerGroup()
            .getLayers()
            .getArray()
            .filter(layer => layer.get('id') !== 'xy-points'),
        })
      )
    }
  }, [map, source])

  /**
   * Interactions
   * ============
   * Add points to form.
   * Remove points from form.
   * cursor styles for bounding
   * box, delete box, etc.
   */
  useEffect(() => {
    map.addInteraction(drawInteraction)
    map.getViewport().addEventListener('mouseenter', mouseenter)
    map.getViewport().addEventListener('mouseleave', mouseleave)

    return () => {
      map.getViewport().removeEventListener('mouseenter', mouseenter)
      map.getViewport().removeEventListener('mouseleave', mouseleave)
      awaitGeometryFunction.current?.then(() => map.removeInteraction(drawInteraction))
    }
  }, [map, drawInteraction, mouseenter, mouseleave])

  return (
    <Typography
      variant="caption"
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        backgroundColor: theme => alpha(theme.palette.common.white, 0.8),
        m: theme => theme.spacing(0),
        p: theme => theme.spacing(0.5),
      }}
    >
      ©{' '}
      <Link
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.openstreetmap.org/copyright"
      >
        OpenStreetMap
      </Link>{' '}
      contributors
    </Typography>
  )
}
