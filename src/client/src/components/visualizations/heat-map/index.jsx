import VectorSource from 'ol/source/Vector'
import WKT from 'ol/format/WKT'
import Heatmap from 'ol/layer/Heatmap'

/**
 * Returns an ol/Layer instance
 */
export default ({
  id = 'heatmap',
  data,
  opacity,
  zoom,
  blur,
  radius,
  filter = () => true,
  gradient = [
    '#005D8B',
    '#0082A6',
    '#00A6AA',
    '#20C89A',
    '#96E480',
    '#F9F871',
    '#F9F871',
    '#FFD357',
    '#FFA95B',
  ], // https://mycolor.space/
}) => {
  const format = new WKT()
  return new Heatmap({
    id,
    opacity,
    weight: feature => feature.get('weighting'),
    gradient,
    source: new VectorSource({
      features: data.POINT_LOCATIONS.data
        .filter(filter)
        .map(({ xy, weighting }) =>
          xy
            .replace('GEOMETRYCOLLECTION (', '')
            .replace('))', ')')
            .split(',')
            .map(point => {
              const feature = format.readFeature(point.trim(), {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:4326',
              })

              feature.set('weighting', weighting)
              return feature
            })
        )
        .flat(),
    }),
    blur: blur || 15 * (10 - zoom), // default 15
    radius: radius || 8 * (10 - zoom) - 4, // default 8
  })
}
