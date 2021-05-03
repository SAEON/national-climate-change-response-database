export const NCCRD_DEPLOYMENT_ENV = process.env.NCCRD_DEPLOYMENT_ENV || 'development'
export const NCCRD_CLIENT_DEFAULT_NOTICES = process.env.NCCRD_CLIENT_DEFAULT_NOTICES || '' // "msg,info;msg2,warn;msg3,error;etd"
export const NCCRD_API_ADDRESS = process.env.NCCRD_API_ADDRESS || 'http://localhost:3000'
export const NCCRD_API_HTTP_ADDRESS = `${NCCRD_API_ADDRESS}/http`
export const NCCRD_API_GQL_ADDRESS = `${NCCRD_API_ADDRESS}/graphql`
export const PACKAGE_DESCRIPTION = process.env.PACKAGE_DESCRIPTION.toString()
export const PACKAGE_KEYWORDS = process.env.PACKAGE_KEYWORDS.toString().split(',')
export const NCCRD_TECHNICAL_CONTACT = process.env.NCCRD_TECHNICAL_CONTACT || 'zach@saeon.ac.za'
export const NCCRD_CLIENT_BACKGROUNDS = process.env.NCCRD_CLIENT_BACKGROUNDS || ''

const url = new URL(NCCRD_API_ADDRESS)
export const NCCRD_API_GQL_SUBSCRIPTIONS_ADDRESS = `${url.protocol === 'http:' ? 'ws:' : 'wss:'}//${
  url.hostname
}${url.port ? `:${url.port}` : ''}/graphql`
