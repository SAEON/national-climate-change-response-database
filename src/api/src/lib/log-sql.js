import { LOG_SQL_QUERIES } from '../config.js'
import { format } from 'sql-formatter'

export default (sql, name, force = false) => {
  if (LOG_SQL_QUERIES || force) {
    console.info(
      `\n===== SQL Query # ${name || 'anonymous'}`,
      `\n\n${format(sql, { language: 'tsql' })}\n`
    )
  }
}
