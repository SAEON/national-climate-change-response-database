import VectorSource from 'ol/source/Vector'
import WKT from 'ol/format/WKT'
import { Heatmap as HeatmapLayer } from 'ol/layer'

/**
 * Returns an ol/Layer instance
 */
export default data => {
  const format = new WKT()
  return new HeatmapLayer({
    gradient: ['#893448', '#d95850', '#eb8146', '#ffb248', '#f2d643', '#ebdba4'],
    source: new VectorSource({
      features: data.POINT_LOCATIONS.data.map(({ xy, normalizedBudget }) => {
        const feature = format.readFeature(xy, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:4326',
        })

        feature.set('normalizedBudget', normalizedBudget)
        return feature
      }),
    }),
    blur: 100,
    radius: 80,
  })
}
