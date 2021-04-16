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

const App = lazy(() => import('./app'))

render(
  <Suspense fallback={<Loading />}>
    <App />
  </Suspense>,
  document.getElementById('root')
)
