import { createPortal } from 'react-dom'
import Provider from './_context'
import Uploads from './_uploads'
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
          <Typography variant="body1">
            Excel templates are shared across all sub-deployments (tenants). Only the most recent
            template is ever used
          </Typography>
        </CardContent>
      </Card>
      <Div sx={{ marginTop: theme => theme.spacing(2) }} />
      <Uploads />
    </Provider>
  )
}
