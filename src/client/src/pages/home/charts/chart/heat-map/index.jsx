import { useEffect, useContext } from 'react'
import { gql, useQuery } from '@apollo/client'
import Map, { context as mapContext } from '../../../../../components/ol-react'
import { context as clientContext } from '../../../../../contexts/client-context'
import baseLayer from '../../../../../components/ol-react/layers/terrestris-base-map'
import { Div } from '../../../../../components/html-tags'
import { alpha } from '@mui/material/styles'
import VectorSource from 'ol/source/Vector'
import WKT from 'ol/format/WKT'
import { parse } from 'wkt'
import { Heatmap as HeatmapLayer } from 'ol/layer'

const D = props => (
  <Div sx={{ height: 'calc(100vh - 220px)', with: '100%', position: 'relative' }} {...props} />
)

const HeatMap = () => {
  const { map } = useContext(mapContext)
  const { error, data: gqlResponse } = useQuery(
    gql`
      query ($POINT_LOCATIONS: Chart!) {
        POINT_LOCATIONS: chart(id: $POINT_LOCATIONS)
      }
    `,
    {
      fetchPolicy: 'no-cache',
      variables: {
        POINT_LOCATIONS: 'POINT_LOCATIONS',
      },
    }
  )

  if (error) {
    throw error
  }

  useEffect(() => {
    if (gqlResponse) {
      const {
        POINT_LOCATIONS: { data },
      } = gqlResponse

      const format = new WKT()

      const features = data.map(({ xy, normalizedBudget }) => {
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
  }, [gqlResponse, map])

  return null
}

export default ({ children }) => {
  const {
    region: { centroid },
    isDefault: isDefaultTenant,
  } = useContext(clientContext)

  const [x, y] = parse(centroid).coordinates
  return (
    <D>
      {children}
      <Div
        sx={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          zIndex: 99,
          opacity: 1,
          backgroundColor: theme => alpha(theme.palette.common.black, 0.5),
          backgroundImage: theme =>
            `linear-gradient(${alpha(
              theme.palette.primary.main,
              0.1
            )} 0.7000000000000001px, transparent 0.7000000000000001px)`,
          backgroundSize: '10px 10px',
        }}
      />
      <Map
        view={{
          zoom: isDefaultTenant ? 6.5 : 7.5,
          center: [x, y],
        }}
        interactions={[]}
        controls={[]}
        baseLayer={[baseLayer()]}
      >
        <HeatMap />
      </Map>
    </D>
  )
}
