import { useContext, useEffect, useCallback } from 'react'
import { context as mapContext } from '../../../../components/ol-react'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import Draw from 'ol/interaction/Draw'
import LayerGroup from 'ol/layer/Group'

var draw

export default () => {
  const { map } = useContext(mapContext)

  const mouseenter = useCallback(() => map.addInteraction(draw), [map])
  const mouseleave = useCallback(() => map.removeInteraction(draw), [map])

  useEffect(() => {
    // TODO add existing points to the source
    const source = new VectorSource({ wrapX: false })

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

    draw = new Draw({
      type: 'Point',
      source,
    })

    draw.on('click', () => alert('hi'))

    map.getViewport().addEventListener('mouseenter', mouseenter)
    map.getViewport().addEventListener('mouseleave', mouseleave)

    return () => {
      map.getViewport().removeEventListener('mouseenter', mouseenter)
      map.getViewport().removeEventListener('mouseleave', mouseleave)
      map.removeInteraction(draw)
      draw = undefined

      // Get features and add to the form
      // Remove the layer from the map
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
  }, [map, mouseenter, mouseleave])

  return null
}

// const onClick = useCallback(e => {
//   console.log(e.coordinate)
// }, [])
