import ApolloProvider from '../components/apollo'
import ClientInfoProvider from '../contexts/client-info'
import AuthenticationProvider from '../contexts/authentication'
import AuthorizationProvider from '../contexts/authorization'
import SnackbarProvider from '../components/notistack'
import NativeExtensions from '../components/native-extensions'
import DefaultApplicationNotices from '../components/default-application-notices'
import BackgroundImageProvider from '../contexts/background-image'
import ErrorBoundary from '../components/error-boundary'
import CookieConsent from '../components/cookie-consent'
import DetectDevice from '../components/detect-device'
import Layout from '../layout'
import CssBaseline from '@mui/material/CssBaseline'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'

export default () => {
  return (
    <CssBaseline>
      <ErrorBoundary>
        <DetectDevice>
          <NativeExtensions>
            <ApolloProvider>
              <ClientInfoProvider>
                <CookieConsent>
                  <AuthenticationProvider>
                    <AuthorizationProvider>
                      <BackgroundImageProvider>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                          <SnackbarProvider>
                            <DefaultApplicationNotices>
                              <Layout />
                            </DefaultApplicationNotices>
                          </SnackbarProvider>
                        </LocalizationProvider>
                      </BackgroundImageProvider>
                    </AuthorizationProvider>
                  </AuthenticationProvider>
                </CookieConsent>
              </ClientInfoProvider>
            </ApolloProvider>
          </NativeExtensions>
        </DetectDevice>
      </ErrorBoundary>
    </CssBaseline>
  )
}
