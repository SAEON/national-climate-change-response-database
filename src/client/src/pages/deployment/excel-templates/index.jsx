import { createPortal } from 'react-dom'
import Provider from './_context'
import Uploads from './_uploads'
import Header from './header'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import useTheme from '@mui/material/styles/useTheme'
import Typography from '@mui/material/Typography'

export default ({ active, headerRef }) => {
  const theme = useTheme()

  if (!active) {
    return null
  }

  if (!headerRef) {
    return null
  }

  return (
    <Provider>
      {createPortal(<Header />, headerRef)}
      <Card variant="overline">
        <CardContent>
          <Typography>
            Excel templates are shared across all sub-deployments (tenants). Only the most recent
            template is ever used
          </Typography>
        </CardContent>
      </Card>
      <div style={{ marginTop: theme.spacing(2) }} />
      <Uploads />
    </Provider>
  )
}
