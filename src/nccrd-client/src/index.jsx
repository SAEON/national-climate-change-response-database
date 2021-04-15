if (!window.crypto) window.crypto = window.msCrypto // IE 11
import 'core-js' // babel.useBuiltIns = entry
import 'cross-fetch/polyfill' // IE 11
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch' // IE 11
import { lazy, Suspense } from 'react'
import Loading from './components/loading'
import 'typeface-roboto'
import './index.scss'
import './lib/log-config'
import { render } from 'react-dom'

const App = lazy(() => import('./app'))

render(
  <Suspense fallback={<Loading />}>
    <App />
  </Suspense>,
  document.getElementById('root')
)
