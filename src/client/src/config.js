export const DEPLOYMENT_ENV = process.env.DEPLOYMENT_ENV || 'development'
export const DEFAULT_NOTICES = process.env.DEFAULT_NOTICES || '' // "msg,info;msg2,warn;msg3,error;etd"

export const HOSTNAME = process.env.HOSTNAME
  ? process.env.HOSTNAME === 'origin'
    ? window.location.origin
    : process.env.HOSTNAME
  : 'http://localhost:3000'

export const DEFAULT_TENANT_ADDRESS = process.env.DEFAULT_TENANT_ADDRESS || 'http://localhost:3001'

export const NCCRD_API_HTTP_ADDRESS = `${HOSTNAME}/http`
export const GQL_HOSTNAME = `${HOSTNAME}/graphql`
export const PACKAGE_DESCRIPTION = process.env.PACKAGE_DESCRIPTION.toString()
export const PACKAGE_KEYWORDS = process.env.PACKAGE_KEYWORDS.toString().split(',')
export const NCCRD_TECHNICAL_CONTACT =
  process.env.NCCRD_TECHNICAL_CONTACT || 'zd.smith@saeon.nrf.ac.za'
