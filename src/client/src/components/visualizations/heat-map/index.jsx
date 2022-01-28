import { useEffect, useContext } from 'react'
import { context as mapContext } from '../../../components/ol-react'
import VectorSource from 'ol/source/Vector'
import WKT from 'ol/format/WKT'
import { Heatmap as HeatmapLayer } from 'ol/layer'

export default ({ data }) => {
  const { map } = useContext(mapContext)
  console.log('rendering heat map')

  useEffect(() => {
    if (data) {
      console.log('adding data layer', data)
      const format = new WKT()

      const features = data.POINT_LOCATIONS.data.map(({ xy, normalizedBudget }) => {
        const feature = format.readFeature(xy, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:4326',
        })

        feature.set('normalizedBudget', normalizedBudget)
        return feature
      })

      const heatMap = new HeatmapLayer({
        gradient: ['#893448', '#d95850', '#eb8146', '#ffb248', '#f2d643', '#ebdba4'],
        opacity: 0,
        source: new VectorSource({
          features,
        }),
        blur: 100,
        radius: 80,
        // weight: feature => feature.get('normalizedBudget'),
      })

      map.addLayer(heatMap)
      heatMap.setOpacity(1)
    }
  }, [data, map])

  return null
}
