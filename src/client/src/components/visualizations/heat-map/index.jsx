import VectorSource from 'ol/source/Vector'
import WKT from 'ol/format/WKT'
import Heatmap from 'ol/layer/Heatmap'

/**
 * Returns an ol/Layer instance
 */
export default ({ data, opacity }) => {
  const format = new WKT()
  return new Heatmap({
    opacity,
    weight: feature => feature.get('weighting'),
    gradient: ['#893448', '#d95850', '#eb8146', '#ffb248', '#f2d643', '#ebdba4'],
    source: new VectorSource({
      features: data.POINT_LOCATIONS.data
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
    blur: 80, // default 15
    radius: 20, // default 8
  })
}
