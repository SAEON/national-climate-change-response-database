import { createPortal } from 'react-dom'
import Provider from './_context'
import Table from './table'
import Header from './header'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { Div } from '../../../components/html-tags'

export default ({ active, headerRef }) => {
  if (!active) {
    return null
  }

  if (!headerRef) {
    return null
  }

  return (
    <Provider>
      {createPortal(<Header />, headerRef)}
      <Card variant="outlined">
        <CardContent>
          <Typography>
            When adding tenants to the deployment, you will need to (1) configure an Nginx server
            block, (2) update the authentication client with callback URLs suited to the new tenant
            domain, and (3) restart the application server to configure the new tenant&apos;s
            authentication client
          </Typography>
        </CardContent>
      </Card>
      <Div sx={{ marginTop: theme => theme.spacing(2) }} />
      <Table />
    </Provider>
  )
}
