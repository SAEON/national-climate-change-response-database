import React from 'react'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import useTheme from '@material-ui/core/styles/useTheme'
import useStyles from './style'

const TabPanel = props => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

const a11yProps = index => {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  }
}

export default () => {
  const theme = useTheme()
  const classes = useStyles()
  const [value, setValue] = React.useState(0)

  return (
    <div className={classes.root}>
      <Tabs
        orientation="vertical"
        value={value}
        onChange={(e, newVal) => setValue(newVal)}
        aria-label="Vertical tabs example"
        style={{
          borderRight: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Tab classes={{ wrapper: classes.wrapper }} label="Users" {...a11yProps(0)} />
        <Tab classes={{ wrapper: classes.wrapper }} label="Roles" {...a11yProps(1)} />
        <Tab classes={{ wrapper: classes.wrapper }} label="Permissions" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        Item One
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
    </div>
  )
}
