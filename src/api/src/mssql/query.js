import { pool } from './pool.js'

export default async query => {
  return pool
    .connect()
    .then(pool => pool.request({ multiple: true }).query(query))
    .catch(error => {
      throw error
    })
}
