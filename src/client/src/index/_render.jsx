import AuthenticationProvider from '../contexts/authentication'
import AuthorizationProvider from '../contexts/authorization'
import SnackbarProvider from '../components/notistack'
import NativeExtensions from '../components/native-extensions'
import DefaultApplicationNotices from '../components/default-application-notices'
import CookieConsent from '../components/cookie-consent'
import DetectDevice from '../components/detect-device'
import CssBaseline from '@mui/material/CssBaseline'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { BrowserRouter as Router } from 'react-router-dom'
import LayoutProvider from '../contexts/layout'

export default ({ children }) => {
  return (
    <Router>
      <CssBaseline>
        <DetectDevice>
          <NativeExtensions>
            <CookieConsent>
              <AuthenticationProvider>
                <AuthorizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <SnackbarProvider>
                      <DefaultApplicationNotices>
                        <LayoutProvider>{children}</LayoutProvider>
                      </DefaultApplicationNotices>
                    </SnackbarProvider>
                  </LocalizationProvider>
                </AuthorizationProvider>
              </AuthenticationProvider>
            </CookieConsent>
          </NativeExtensions>
        </DetectDevice>
      </CssBaseline>
    </Router>
  )
}
