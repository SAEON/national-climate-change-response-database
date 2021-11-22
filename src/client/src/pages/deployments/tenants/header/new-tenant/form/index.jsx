import FormGroup from '@mui/material/FormGroup'
import { useContext, useRef, useEffect } from 'react'
import { context as formContext } from '../_context'
import Hostname from './hostname'
import Logo from './logo'
import Theme from './theme'
import Geofence from './geofence'
import Flag from './flag'
import Title from './title'
import ShortTitle from './short-title'
import Description from './description'
import Grid from '@mui/material/Grid'
import DialogContent from '@mui/material/DialogContent'

const Form = () => {
  return (
    <DialogContent dividers>
      <FormGroup>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Hostname />
            <Title />
            <ShortTitle />
            <Description />
            <Logo />
            <Flag />
            <Geofence />
          </Grid>
          <Grid item xs={12} md={6}>
            <Theme />
          </Grid>
        </Grid>
      </FormGroup>
    </DialogContent>
  )
}

export default () => {
  // Reset the form on dismount
  const { resetForm } = useContext(formContext)
  const ref = useRef(resetForm)
  useEffect(() => () => ref.current && ref.current(), [])

  return <Form />
}
