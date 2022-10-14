import { useContext } from 'react'
import { context as clientContext } from '../../contexts/client-context'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { NCCRD_TECHNICAL_CONTACT } from '../../config'

export default () => {
  const { contactEmailAddress } = useContext(clientContext)

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">Contact us</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">Website and technical feedback</Typography>
        <Typography variant="body2">{NCCRD_TECHNICAL_CONTACT.replace('@', ' [ at ] ')}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="body1">Data enquiries</Typography>
        <Typography variant="body2">
          {contactEmailAddress?.replace('@', ' [ at ] ') || 'Missing contact address'}
        </Typography>
      </Grid>
    </Grid>
  )
}
