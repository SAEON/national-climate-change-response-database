import { config } from 'dotenv'
config()

export const NCCRD_API_KEY =
  process.env.NCCRD_API_KEY || '7cwANClfrqqNFmpOmcP0OzWDzdcras0EdIqD3RAUUCU='

export const NCCRD_DEFAULT_ADMIN_EMAIL_ADDRESSES =
  process.env.NCCRD_DEFAULT_ADMIN_EMAIL_ADDRESSES || ''

export const NCCRD_API_GOOGLE_CLIENT_ID = process.env.NCCRD_API_GOOGLE_CLIENT_ID || ''
export const NCCRD_API_GOOGLE_CLIENT_SECRET = process.env.NCCRD_API_GOOGLE_CLIENT_SECRET || ''
export const NCCRD_API_GOOGLE_OAUTH_REDIRECT_ADDRESS =
  process.env.NCCRD_API_GOOGLE_OAUTH_REDIRECT_ADDRESS ||
  'http://localhost:3000/http/authenticate/redirect/google'

export const NCCRD_DEPLOYMENT_ENV = process.env.NCCRD_DEPLOYMENT_ENV || 'development'

export const NCCRD_API_NODE_ENV = process.env.NCCRD_API_NODE_ENV || 'development'

export const MONGO_DB = process.env.MONGO_DB || 'nccrd'

export const MONGO_DB_ADDRESS = process.env.MONGO_DB_ADDRESS || 'mongodb://localhost:27017'

export const MONGO_DB_USERNAME = process.env.MONGO_DB_USERNAME || 'admin'

export const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD || 'password'

export const NCCRD_API_ADDRESS = process.env.NCCRD_API_ADDRESS || 'http://localhost:3000'

export const NCCRD_API_ADDRESS_PORT = process.env.NCCRD_API_ADDRESS_PORT || 3000

export const NCCRD_API_GQL_ADDRESS = `${NCCRD_API_ADDRESS}/graphql`

export const NCCRD_API_ALLOWED_ORIGINS =
  process.env.NCCRD_API_ALLOWED_ORIGINS ||
  'http://localhost:3000,http://localhost:3001,http://localhost:8080'

export const NCCRD_CLIENT_ID = process.env.NCCRD_CLIENT_ID || 'client.sess'
