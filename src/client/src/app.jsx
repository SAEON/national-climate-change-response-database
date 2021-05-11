import ApolloProvider from './components/apollo'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'
import ClientInfoProvider from './contexts/client-info'
import AuthenticationProvider from './contexts/authentication'
import AuthorizationProvider from './contexts/authorization'
import { SnackbarProvider } from 'notistack'
import NativeExtensions from './components/native-extensions'
import DefaultApplicationNotices from './components/default-application-notices'
import BackgroundImageProvider from './contexts/background-image'
import ErrorBoundary from './components/error-boundary'
import CookieConsent from './components/cookie-consent'
import DetectDevice from './components/detect-device'
import Layout from './layout'

export default () => {
  return (
    <ErrorBoundary>
      <DetectDevice>
        <NativeExtensions>
          <ApolloProvider>
            <ClientInfoProvider>
              <CookieConsent>
                <AuthenticationProvider>
                  <AuthorizationProvider>
                    <BackgroundImageProvider>
                      <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <SnackbarProvider>
                          <DefaultApplicationNotices>
                            <Layout />
                          </DefaultApplicationNotices>
                        </SnackbarProvider>
                      </MuiPickersUtilsProvider>
                    </BackgroundImageProvider>
                  </AuthorizationProvider>
                </AuthenticationProvider>
              </CookieConsent>
            </ClientInfoProvider>
          </ApolloProvider>
        </NativeExtensions>
      </DetectDevice>
    </ErrorBoundary>
  )
}
