import FormGroup from '@mui/material/FormGroup'
import Hostname from './hostname'
import Logo from './logo'
import Theme from './theme'
import Geofence from './geofence'
import Flag from './flag'
import Title from './title'

export default () => {
  return (
    <FormGroup>
      <Title />
      <Hostname />
      <Logo />
      <Flag />
      <Geofence />
      <Theme />
    </FormGroup>
  )
}
