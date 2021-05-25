import { memo, useContext } from 'react'
import { context as formContext } from '../../gql-form-binder'
import WithBoundingRegion from './with-bounding-region'
import Map, { GeometryLayer } from '../../../../components/ol-react'
import Picker from './picker'
import useTheme from '@material-ui/core/styles/useTheme'
import Toolbar from './toolbar'

var arraysMatch = function (arr1, arr2) {
  if (arr1.length !== arr2.length) return false
  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false
  }
  return true
}

const LocationBounds = memo(
  ({ localMunicipality, districtMunicipality, province, onChange, points, setPoints }) => {
    const theme = useTheme()

    const boundingRegions = {
      province,
      districtMunicipality,
      localMunicipality,
    }

    return (
      <>
        <WithBoundingRegion boundingRegions={boundingRegions}>
          {({ geometry }) => {
            const fenceId = 'input-fence'
            return (
              <div
                style={{ width: '100%', height: 400, border: theme.border, position: 'relative' }}
              >
                <Map>
                  <>
                    {geometry && <GeometryLayer id={fenceId} geometry={geometry} />}
                    <Picker
                      setPoints={setPoints}
                      fenceGeometry={geometry}
                      fenceId={fenceId}
                      onChange={onChange}
                      points={points}
                    />
                    <Toolbar points={points} setPoints={setPoints} />
                  </>
                </Map>
              </div>
            )
          }}
        </WithBoundingRegion>
      </>
    )
  },
  (a, b) => {
    let _memo = true
    if (a.localMunicipality !== b.localMunicipality) _memo = false
    if (a.districtMunicipality !== b.districtMunicipality) _memo = false
    if (a.province !== b.province) _memo = false
    if (!arraysMatch(a.points, b.points)) _memo = false
    return _memo
  }
)

export default ({ onChange, points, setPoints }) => {
  const { projectForm } = useContext(formContext)
  return (
    <LocationBounds {...projectForm} onChange={onChange} points={points} setPoints={setPoints} />
  )
}
