import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import WKT from 'ol/format/WKT'

export default ({ id = 'vector-layer', wkt, ...props }) => {
  const format = new WKT()
  const feature = format.readFeature(wkt, {
    dataProjection: 'EPSG:4326',
    featureProjection: 'EPSG:4326',
  })

  return new VectorLayer({
    id,
    source: new VectorSource({
      features: [feature],
    }),
    ...props,
  })
}
