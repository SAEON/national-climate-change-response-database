import passport from 'koa-passport'
import { Issuer } from 'openid-client'
import {
  SAEON_AUTH_CLIENT_SECRET,
  SAEON_AUTH_CLIENT_ID,
  SAEON_AUTH_ADDRESS_WELLKNOWN,
} from '../config.js'
import makeStrategy from './_strategy.js'
import './_serialize-user.js'
import './_deserialize-user.js'

if (!SAEON_AUTH_CLIENT_ID || !SAEON_AUTH_CLIENT_SECRET) {
  console.error('OAUTH credentials not provided')
  process.exit(1)
}

Issuer.discover(SAEON_AUTH_ADDRESS_WELLKNOWN)
  .then(oauthProvider => passport.use('oidc', makeStrategy(oauthProvider)))
  .then(() => console.info('Authentication configured successfully'))
  .catch(error => console.error('Unable to configure oauth2 oidc strategy', error))
