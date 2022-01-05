import { HOSTNAME } from './_app.js'

export const ODP_ADDRESS = process.env.ODP_ADDRESS || 'https://odp.saeon.ac.za'
export const ODP_AUTH_CLIENT_ID = process.env.ODP_AUTH_CLIENT_ID || 'SAEON.NCCIS'
export const ODP_AUTH_SCOPES = 'SAEON.NCCIS openid'
export const ODP_AUTH_CLIENT_SECRET = process.env.ODP_AUTH_CLIENT_SECRET || ''
export const ODP_AUTH = `${ODP_ADDRESS}/auth`
export const ODP_AUTH_WELL_KNOWN = `${ODP_AUTH}/.well-known/openid-configuration`
export const ODP_AUTH_LOGOUT_REDIRECT = `${ODP_AUTH}/oauth2/sessions/logout`
export const ODP_AUTH_REDIRECT_PATH = '/http/authenticate/redirect/saeon'
export const ODP_AUTH_REDIRECT_ADDRESS = `${HOSTNAME}${ODP_AUTH_REDIRECT_PATH}`
