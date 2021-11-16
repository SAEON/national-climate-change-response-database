import ApolloProvider from '../components/apollo'
import AuthenticationProvider from '../contexts/authentication'
import AuthorizationProvider from '../contexts/authorization'
import SnackbarProvider from '../components/notistack'
import NativeExtensions from '../components/native-extensions'
import DefaultApplicationNotices from '../components/default-application-notices'
import BackgroundImageProvider from '../contexts/background-image'
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
            <ApolloProvider>
              <CookieConsent>
                <AuthenticationProvider>
                  <AuthorizationProvider>
                    <BackgroundImageProvider>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <SnackbarProvider>
                          <DefaultApplicationNotices>
                            <LayoutProvider>{children}</LayoutProvider>
                          </DefaultApplicationNotices>
                        </SnackbarProvider>
                      </LocalizationProvider>
                    </BackgroundImageProvider>
                  </AuthorizationProvider>
                </AuthenticationProvider>
              </CookieConsent>
            </ApolloProvider>
          </NativeExtensions>
        </DetectDevice>
      </CssBaseline>
    </Router>
  )
}
