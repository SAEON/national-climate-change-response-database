import { memo, useContext } from 'react'
import { context as formContext } from '../../gql-form-binder'
import WithBoundingRegion from './with-bounding-region'
import Map, { GeometryLayer } from '../../../../components/ol-react'
import Picker from './picker'
import useTheme from '@material-ui/core/styles/useTheme'

const LocationBounds = memo(
  ({ localMunicipality, districtMunicipality, province }) => {
    const theme = useTheme()

    const boundingRegions = {
      province,
      districtMunicipality,
      localMunicipality,
    }

    return (
      <WithBoundingRegion boundingRegions={boundingRegions}>
        {({ geometry }) => {
          return (
            <div style={{ width: '100%', height: 400, border: theme.border }}>
              <Map>
                <>
                  {geometry && <GeometryLayer id="bounding-box" geometry={geometry} />}
                  <Picker />
                </>
              </Map>
            </div>
          )
        }}
      </WithBoundingRegion>
    )
  },
  (a, b) => {
    let _memo = true
    if (a.localMunicipality !== b.localMunicipality) _memo = false
    if (a.districtMunicipality !== b.districtMunicipality) _memo = false
    if (a.province !== b.province) _memo = false
    return _memo
  }
)

export default () => {
  const { projectForm } = useContext(formContext)
  return <LocationBounds {...projectForm} />
}
