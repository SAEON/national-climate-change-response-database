import VectorSource from 'ol/source/Vector'
import WKT from 'ol/format/WKT'
import Heatmap from 'ol/layer/Heatmap'

window.VectorSource = VectorSource
window.WKT = WKT
window.Heatmap = Heatmap

/**
 * Returns an ol/Layer instance
 */
export default data => {
  const format = new WKT()
  return new Heatmap({
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
