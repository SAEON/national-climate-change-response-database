import { Vector as VectorLayer } from 'ol/layer.js'

export const clusterLayer = ({ source, id = null, style }) =>
  new VectorLayer({
    title: id,
    visible: true,
    id,
    source,
    style,
  })
