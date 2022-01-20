import { memo, useState } from 'react'
import ListInput from './list-input'
import Typography from '@mui/material/Typography'
import QuickForm from '../../../../quick-form'
import debounce from '../../../../../lib/debounce'
import Toolbar from './toolbar'
import Map, { GeometryLayer } from '../../../../ol-react'
import Loading from '../../../../loading'
import { gql, useQuery } from '@apollo/client'
import AppBar from '@mui/material/AppBar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Picker from './picker'
import Fade from '@mui/material/Fade'
import { alpha } from '@mui/material/styles'
import { Div } from '../../../../html-tags'

export default memo(
  ({ onChange, points, setPoints, geofence }) => {
    const { loading, error, data } = useQuery(
      gql`
        query regions($terms: [String!]!) {
          regions(terms: $terms) {
            id
            name
            geometry
          }
        }
      `,
      {
        variables: {
          terms: geofence.map(({ term }) => term),
        },
      }
    )

    if (loading) {
      return <Loading />
    }

    if (error) {
      throw error
    }

    return (
      <LocationBounds
        geofencePolygons={data.regions}
        onChange={onChange}
        points={points}
        setPoints={setPoints}
      />
    )
  },
  (a, b) => {
    const { geofence: aGeofence, points: aPoints } = a
    const { geofence: bGeofence, points: bPoints } = b

    if (JSON.stringify(aGeofence) !== JSON.stringify(bGeofence)) return false
    if (JSON.stringify(aPoints) !== JSON.stringify(bPoints)) return false

    return true
  }
)

const TabPanel = props => {
  const { children, value, index, ...other } = props

  return (
    <Div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Fade in={value === index} key={index}>
        <Box p={0}>{children}</Box>
      </Fade>
    </Div>
  )
}

function a11yProps(index) {
  return {
    id: `location-picker-tab-${index}`,
    'aria-controls': `location-picker-tab-${index}`,
  }
}

const Input = ({ geofencePolygons, update, points }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  return (
    <>
      <AppBar
        sx={{ zIndex: 1 }}
        variant="outlined"
        elevation={0}
        color="default"
        position="relative"
      >
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
        <Div
          sx={{
            width: '100%',
            height: 400,
            border: theme => `1px solid ${alpha(theme.palette.common.black, 0.12)}`,
            position: 'relative',
          }}
        >
          <Map>
            {geofencePolygons.map(({ geometry, id }) => (
              <GeometryLayer key={id} id={id} geometry={geometry} />
            ))}
            <Picker
              geofencePolygons={geofencePolygons}
              setPoints={points => update({ points })}
              points={points}
            />
            <Toolbar points={points} setPoints={points => update({ points })} />
          </Map>
        </Div>
      </TabPanel>
      <TabPanel value={activeTabIndex} index={1}>
        <Div
          sx={{
            width: '100%',
            height: 400,
            border: theme => `1px solid ${alpha(theme.palette.common.black, 0.12)}`,
            position: 'relative',
          }}
        >
          <ListInput setPoints={points => update({ points })} points={points} />
        </Div>
      </TabPanel>
    </>
  )
}

const LocationBounds = ({ points, setPoints, geofencePolygons }) => {
  return (
    <QuickForm
      effects={[
        debounce(({ points }) => {
          setPoints(points)
        }),
      ]}
      points={points}
    >
      {(update, { points }) => {
        return (
          <Div sx={{ marginTop: theme => theme.spacing(3) }}>
            <Typography
              sx={{
                display: 'block',
                textAlign: 'center',
                marginBottom: theme => theme.spacing(1),
              }}
              variant="overline"
            >
              Add GPS location points
            </Typography>
            <Input geofencePolygons={geofencePolygons} update={update} points={points} />
          </Div>
        )
      }}
    </QuickForm>
  )
}
