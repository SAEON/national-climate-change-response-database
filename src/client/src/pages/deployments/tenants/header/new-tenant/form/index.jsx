import FormGroup from '@mui/material/FormGroup'
import Hostname from './hostname'
import Logo from './logo'
import Theme from './theme'
import Geofence from './geofence'
import Flag from './flag'

export default () => {
  return (
    <FormGroup>
      <Hostname />
      <Logo />
      <Flag />
      <Geofence />
      <Theme />
    </FormGroup>
  )
}
