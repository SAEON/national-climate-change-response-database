import { Tile as TileLayer } from 'ol/layer.js'
import { TileWMS } from 'ol/source'

const URL = `https://www.gebco.net/data_and_products/gebco_web_services/web_map_service/mapserv?`

export default () =>
  new TileLayer({
    title: 'Terrestris Base Map',
    id: 'terrestrisBaseMap',
    visible: true,
    source: new TileWMS({
      url: URL,
      params: {
        LAYERS: 'GEBCO_LATEST_SUB_ICE_TOPO',
        TILED: false,
      },
      serverType: 'geoserver',
    }),
  })
