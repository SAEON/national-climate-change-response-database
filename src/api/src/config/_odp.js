export const ODP_HOSTNAME = process.env.ODP_HOSTNAME || 'odp.saeon.ac.za'
export const ODP_AUTH_CLIENT_ID = process.env.ODP_AUTH_CLIENT_ID || 'SAEON.NCCIS'
export const ODP_AUTH_SCOPES = `${ODP_AUTH_CLIENT_ID} openid`
export const ODP_AUTH_CLIENT_SECRET = process.env.ODP_AUTH_CLIENT_SECRET || ''
export const ODP_AUTH = `https://auth.${ODP_HOSTNAME}`
export const ODP_AUTH_WELL_KNOWN = `${ODP_AUTH}/.well-known/openid-configuration`
export const ODP_AUTH_LOGOUT_REDIRECT = `${ODP_AUTH}/oauth2/sessions/logout`
export const ODP_AUTH_REDIRECT_PATH = '/http/authenticate/redirect/saeon'
