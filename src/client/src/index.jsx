import 'core-js'
import 'regenerator-runtime'
import 'typeface-roboto'
import './index.scss'
import './lib/log-config'
import { lazy, Suspense } from 'react'
import { render } from 'react-dom'
import Loading from './components/loading'
if (!window.crypto) window.crypto = window.msCrypto // IE 11
import 'cross-fetch/polyfill' // IE 11
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch' // IE 11
import CssBaseline from '@material-ui/core/CssBaseline'
import { ThemeProvider } from '@material-ui/core/styles'
import theme from './theme'

const App = lazy(() => import('./app'))

render(
  <CssBaseline>
    <ThemeProvider theme={theme}>
      <Suspense fallback={<Loading />}>
        <App />
      </Suspense>
    </ThemeProvider>
  </CssBaseline>,
  document.getElementById('root')
)
