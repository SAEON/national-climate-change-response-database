import { useContext, useEffect } from 'react'
import WKT from 'ol/format/WKT'
import { context as mapContext } from './index'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import LayerGroup from 'ol/layer/Group'

export default ({ id, geometry: wkt }) => {
  const { map } = useContext(mapContext)

  useEffect(() => {
    if (!wkt) return

    const layer = new VectorLayer({
      id,
      source: new VectorSource({
        features: [
          new WKT().readFeature(wkt, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:4326',
          }),
        ],
      }),
    })

    map.setLayerGroup(
      new LayerGroup({
        layers: [...map.getLayerGroup().getLayers().getArray(), layer],
      })
    )

    return () =>
      map.setLayerGroup(
        new LayerGroup({
          layers: map
            .getLayerGroup()
            .getLayers()
            .getArray()
            .filter(layer => layer.get('id') !== id),
        })
      )
  }, [wkt, map, id])

  return null
}
