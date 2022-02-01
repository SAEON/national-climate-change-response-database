import { Tile as TileLayer } from 'ol/layer.js'
import { TileWMS } from 'ol/source'

const URL = `https://ows.terrestris.de/osm-gray/service`

export default ({ id = 'terrestrisBaseMap' } = {}) =>
  new TileLayer({
    title: 'Terrestris Base Map',
    id,
    visible: true,
    source: new TileWMS({
      url: URL,
      params: {
        LAYERS: 'TOPO-WMS',
        TILED: false,
      },
      serverType: 'geoserver',
    }),
  })
