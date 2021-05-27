import { LOG_SQL_QUERIES } from '../config.js'
import { format } from 'sql-formatter'

export default (sql, name) => {
  if (LOG_SQL_QUERIES) {
    console.info(
      `\n===== SQL Query # ${name || 'anonymous'}`,
      `\n\n${format(sql, { language: 'tsql' })}\n`
    )
  }
}
