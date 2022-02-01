import VectorSource from 'ol/source/Vector'
import WKT from 'ol/format/WKT'
import Heatmap from 'ol/layer/Heatmap'

/**
 * Returns an ol/Layer instance
 */
export default ({ data, opacity, zoom, blur, radius, filter = () => true }) => {
  const format = new WKT()
  return new Heatmap({
    opacity,
    weight: feature => feature.get('weighting'),
    gradient: ['#893448', '#d95850', '#eb8146', '#ffb248', '#f2d643', '#ebdba4'],
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
