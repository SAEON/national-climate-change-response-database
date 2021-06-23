import { memo, useContext, useState } from 'react'
import { context as formContext } from '../../gql-form-binder'
import WithBoundingRegion from './with-bounding-region'
import Map, { GeometryLayer } from '../../../../components/ol-react'
import Picker from './picker'
import useTheme from '@material-ui/core/styles/useTheme'
import Toolbar from './toolbar'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import ListInput from './list-input'

const TabPanel = props => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={0}>{children}</Box>}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `location-picker-tab-${index}`,
    'aria-controls': `location-picker-tab-${index}`,
  }
}

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
    const [activeTabIndex, setActiveTabIndex] = useState(0)

    const boundingRegions = {
      province,
      districtMunicipality,
      localMunicipality,
    }

    return (
      <WithBoundingRegion boundingRegions={boundingRegions}>
        {({ geometry }) => {
          const fenceId = 'input-fence'
          return (
            <>
              <AppBar style={{ zIndex: 1 }} variant="outlined" color="default" position="relative">
                <Tabs
                  indicatorColor="primary"
                  textColor="primary"
                  value={activeTabIndex}
                  onChange={(e, i) => setActiveTabIndex(i)}
                  aria-label="Location picker"
                >
                  <Tab label="Map input" {...a11yProps(0)} />
                  <Tab label="List input" {...a11yProps(1)} />
                </Tabs>
              </AppBar>
              <TabPanel value={activeTabIndex} index={0}>
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
              </TabPanel>
              <TabPanel value={activeTabIndex} index={1}>
                <div
                  style={{ width: '100%', height: 400, border: theme.border, position: 'relative' }}
                >
                  <ListInput
                    setPoints={setPoints}
                    fenceGeometry={geometry}
                    fenceId={fenceId}
                    addPoint={onChange}
                    points={points}
                  />
                </div>
              </TabPanel>
            </>
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
    if (!arraysMatch(a.points, b.points)) _memo = false
    return _memo
  }
)

export default ({ onChange, points, setPoints }) => {
  const { generalDetailsForm } = useContext(formContext)
  return (
    <LocationBounds
      onChange={onChange}
      points={points}
      setPoints={setPoints}
      {...generalDetailsForm}
    />
  )
}
