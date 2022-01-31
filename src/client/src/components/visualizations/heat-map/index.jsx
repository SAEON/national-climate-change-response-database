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
    weight: 'normalizedBudget',
    gradient: ['#893448', '#d95850', '#eb8146', '#ffb248', '#f2d643', '#ebdba4'],
    source: new VectorSource({
      features: data.POINT_LOCATIONS.data
        .map(({ xy, normalizedBudget }) =>
          xy
            .replace('GEOMETRYCOLLECTION (', '')
            .replace('))', ')')
            .split(',')
            .map(point => {
              const feature = format.readFeature(point.trim(), {
                dataProjection: 'EPSG:4326',
                featureProjection: 'EPSG:4326',
              })

              feature.set('normalizedBudget', normalizedBudget)
              return feature
            })
        )
        .flat(),
    }),
    blur: 55, // default 15
    radius: 15, // default 8
  })
}
