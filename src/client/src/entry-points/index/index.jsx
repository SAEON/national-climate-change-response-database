import '../../index/main'
import { useState } from 'react'
import { render } from 'react-dom'
import RouteSwitcher from '../../index/route-switcher'
import Application from '../../index/application'
import routes from './routes'
import { SizeContent } from '../../contexts/layout'
import Header from '../../components/header'
import Footer from '../../components/footer'
import { SHOW_DEV_WARNING, HOSTNAME } from '../../config'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Link from '@mui/material/Link'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

const Entry = () => {
  const [showDevWarning, setShowDevWarning] = useState(SHOW_DEV_WARNING === 'true' ? true : false)

  return (
    <>
      {/* DEV WARNING */}
      <Dialog
        open={showDevWarning}
        onClose={(e, reason) => {
          if (reason) {
            return
          }
          setShowDevWarning(false)
        }}
      >
        <DialogTitle sx={{ textAlign: 'center' }}>Welcome to the Development platform</DialogTitle>
        <DialogContent>
          You have reached a DEVELOPMENT deployment of the <i>Climate Change Response Database</i>{' '}
          software platform. If you are testing the site you can ignore this message. Otherwise
          please navigate to the live deployment at{' '}
          <Link target="_blank" rel="noopener noreferrer" href={'https://nccrd.environment.gov.za'}>
            nccrd.environment.gov.za
          </Link>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDevWarning(false)} variant="text" size="small">
            I KNOW this is a test deployment
          </Button>
        </DialogActions>
      </Dialog>

      {/* SITE */}
      <Header />
      <SizeContent>
        <RouteSwitcher />
      </SizeContent>
      <Footer />
    </>
  )
}

render(
  <Application routes={routes}>
    <Entry />
  </Application>,
  document.getElementById('root')
)
