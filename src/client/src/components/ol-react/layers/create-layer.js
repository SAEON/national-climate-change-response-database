import { Tile as TileLayer } from 'ol/layer.js'
import { TileWMS, TileArcGISRest } from 'ol/source'

export const LayerTypes = Object.freeze({
  TileArcGISRest: Symbol('TileArcGISRest'),
  TileWMS: Symbol('TileWMS'),
})

export const createLayer = ({
  id,
  title,
  uri,
  LAYERS,
  TILED = true,
  FORMAT = 'image/png',
  layerType,
  ...props
}) =>
  new TileLayer({
    layerType,
    id: id || uri,
    title: title || id,
    visible: true,
    ...props,
    source:
      layerType === LayerTypes.TileWMS
        ? new TileWMS({
            url: uri,
            params: {
              REQUEST: 'GetMap',
              LAYERS,
              TILED,
              FORMAT,
            },
            serverType: 'geoserver',
            transition: 500,
            tileGrid: null,
          })
        : layerType === LayerTypes.TileArcGISRest
        ? new TileArcGISRest({
            url: uri,
          })
        : null,
    opacity: 0.7,
  })
