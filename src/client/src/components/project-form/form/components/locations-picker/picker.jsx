import { useCallback, useContext, useEffect, useMemo, useRef } from 'react'
import { context as mapContext } from '../../../../ol-react'
import { useSnackbar } from 'notistack'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import Draw from 'ol/interaction/Draw'
import LayerGroup from 'ol/layer/Group'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import WKT from 'ol/format/WKT'

const _wkt = new WKT()

export default ({ points = [], setPoints, fenceGeometry = undefined }) => {
  const { enqueueSnackbar } = useSnackbar()
  const { map } = useContext(mapContext)
  const source = useMemo(() => new VectorSource({ wrapX: false }), [])
  const awaitGeometryFunction = useRef(null)

  const fence = useMemo(() => {
    if (!fenceGeometry) return null
    return _wkt.readGeometry(fenceGeometry, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:4326',
    })
  }, [fenceGeometry])

  const draw = useMemo(
    () =>
      new Draw({
        type: 'Point',
        source,
        geometryFunction: ([y, x]) => {
          awaitGeometryFunction.current = new Promise(resolve => {
            if (fence && !fence.intersectsCoordinate([y, x])) {
              enqueueSnackbar('Point input must be within bounds of the selected project region', {
                variant: 'warning',
              })
            }
            resolve()
          })
          setPoints([...points, [y, x]])
        },
      }),
    [source, fence, enqueueSnackbar, setPoints, points]
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
      map.addInteraction(draw)
    }
  }, [draw, map])

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
    const _points = points.filter(point => {
      if (!fence) return true
      return fence.intersectsCoordinate(point)
    })

    if (points.length !== _points.length) {
      setPoints(_points)
    }

    source.addFeatures(
      _points.map(
        point =>
          new Feature({
            geometry: new Point(point),
          })
      )
    )
  }, [points, setPoints, source, map, fence])

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
            id: `yx-points`,
            title: 'YX points',
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
            .filter(layer => layer.get('id') !== 'yx-points'),
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
    map.addInteraction(draw)
    map.getViewport().addEventListener('mouseenter', mouseenter)
    map.getViewport().addEventListener('mouseleave', mouseleave)

    return () => {
      map.getViewport().removeEventListener('mouseenter', mouseenter)
      map.getViewport().removeEventListener('mouseleave', mouseleave)
      awaitGeometryFunction.current?.then(() => map.removeInteraction(draw))
    }
  }, [map, draw, mouseenter, mouseleave])

  return null
}
