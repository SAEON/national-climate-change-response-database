import OSM from 'ol/source/OSM'
import TileLayer from 'ol/layer/Tile'

export default ({ id = 'OSM' } = {}) =>
  new TileLayer({
    id,
    source: new OSM(),
  })
