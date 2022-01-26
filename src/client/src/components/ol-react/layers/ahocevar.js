import { Tile as TileLayer } from 'ol/layer.js'
import { TileWMS } from 'ol/source'
import { PROXY_ADDRESS } from '../../../config'

const URL = `${PROXY_ADDRESS}/ahocevar/geoserver/wms`

export const ahocevarBaseMap = () =>
  new TileLayer({
    title: 'Ahocevar Base Map',
    id: 'ahocevarBaseMap',
    visible: true,
    source: new TileWMS({
      url: URL,
      params: {
        LAYERS: 'ne:NE1_HR_LC_SR_W_DR',
        TILED: true,
      },
    }),
  })
