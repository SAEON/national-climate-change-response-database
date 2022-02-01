import Stamen from 'ol/source/Stamen'
import { Tile as TileLayer } from 'ol/layer'

export default ({ id = 'stamenToner' } = {}) =>
  new TileLayer({
    id,
    source: new Stamen({
      layer: 'toner',
    }),
  })
