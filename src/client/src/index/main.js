import 'core-js'
import 'regenerator-runtime'
import 'typeface-roboto'
import '../index.scss'
import '../lib/log-config'
if (!window.crypto) window.crypto = window.msCrypto // IE 11
import 'cross-fetch/polyfill' // IE 11
import 'abortcontroller-polyfill/dist/polyfill-patch-fetch' // IE 11
