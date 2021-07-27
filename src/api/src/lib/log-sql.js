import { LOG_SQL_QUERIES } from '../config.js'
import { format } from 'sql-formatter'

export default (sql, name, force = false) => {
  const timestamp = new Date().toISOString()

  if (LOG_SQL_QUERIES || force) {
    try {
      console.info(
        timestamp,
        `\n===== SQL # ${name || 'anonymous'}`,
        `\n\n${format(sql, { language: 'tsql' })}\n`
      )
    } catch (error) {
      console.error('Unable to format SQL (I think this is a bug with the sql-formatter library)')
      console.info(sql)
    }
  } else {
    console.info(timestamp, `===== SQL # ${name || 'anonymous'}`)
  }
}
