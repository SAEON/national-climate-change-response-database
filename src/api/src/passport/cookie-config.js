import { NCCRD_SSL_ENV } from '../config.js'

const hoursToMilliseconds = hrs => hrs * 60 * 60 * 1000

export default {
  key: 'koa.sess',
  maxAge: hoursToMilliseconds(12),
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: true,
  renew: false,
  secure: NCCRD_SSL_ENV === 'development' ? false : true,
  sameSite: NCCRD_SSL_ENV === 'development' ? 'lax' : 'none',
}
