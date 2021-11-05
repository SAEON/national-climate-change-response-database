import { memo, useMemo, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import ListInput from './list-input'
import Typography from '@mui/material/Typography'
import QuickForm from '../../../../quick-form'
import debounce from '../../../../../lib/debounce'
import Toolbar from './toolbar'
import Map from '../../../../ol-react'
import AppBar from '@mui/material/AppBar'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Picker from './picker'
import Fade from '@mui/material/Fade'

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
      <Fade in={value === index} key={index}>
        <Box p={0}>{children}</Box>
      </Fade>
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `location-picker-tab-${index}`,
    'aria-controls': `location-picker-tab-${index}`,
  }
}

const Input = ({ update, points }) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const theme = useTheme()

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
        <div style={{ width: '100%', height: 400, border: theme.border, position: 'relative' }}>
          <Map>
            <Picker setPoints={points => update({ points })} points={points} />
            <Toolbar points={points} setPoints={points => update({ points })} />
          </Map>
        </div>
      </TabPanel>
      <TabPanel value={activeTabIndex} index={1}>
        <div style={{ width: '100%', height: 400, border: theme.border, position: 'relative' }}>
          <ListInput setPoints={points => update({ points })} points={points} />
        </div>
      </TabPanel>
    </>
  )
}

const LocationBounds = memo(
  ({ points, setPoints }) => {
    const theme = useTheme()
    const effect = useMemo(() => debounce(({ points }) => setPoints(points)), [setPoints])

    return (
      <QuickForm effect={effect} points={points}>
        {(update, { points }) => {
          return (
            <div style={{ marginTop: theme.spacing(3) }}>
              <Typography
                style={{ display: 'block', textAlign: 'center', marginBottom: theme.spacing(1) }}
                variant="overline"
              >
                Add GPS location points
              </Typography>
              <Input update={update} points={points} />
            </div>
          )
        }}
      </QuickForm>
    )
  },
  /**
   * State is managed internally, and synced
   * to context.
   *
   * Never re-render this component once mounted
   */
  () => true
)

export default ({ onChange, points, setPoints }) => {
  return <LocationBounds onChange={onChange} points={points} setPoints={setPoints} />
}
