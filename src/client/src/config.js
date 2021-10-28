export const NCCRD_DEPLOYMENT_ENV = process.env.NCCRD_DEPLOYMENT_ENV || 'development'
export const NCCRD_CLIENT_DEFAULT_NOTICES = process.env.NCCRD_CLIENT_DEFAULT_NOTICES || '' // "msg,info;msg2,warn;msg3,error;etd"

export const NCCRD_HOSTNAME = process.env.NCCRD_HOSTNAME
  ? process.env.NCCRD_HOSTNAME === 'origin'
    ? window.location.origin
    : process.env.NCCRD_HOSTNAME
  : 'http://localhost:3000'

export const NCCRD_API_HTTP_ADDRESS = `${NCCRD_HOSTNAME}/http`
export const NCCRD_API_GQL_ADDRESS = `${NCCRD_HOSTNAME}/graphql`
export const PACKAGE_DESCRIPTION = process.env.PACKAGE_DESCRIPTION.toString()
export const PACKAGE_KEYWORDS = process.env.PACKAGE_KEYWORDS.toString().split(',')
export const NCCRD_TECHNICAL_CONTACT =
  process.env.NCCRD_TECHNICAL_CONTACT || 'zd.smith@saeon.nrf.ac.za'
