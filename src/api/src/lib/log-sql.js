import { LOG_SQL_QUERIES } from '../config/index.js'
import { format } from 'sql-formatter'
import logger from './logger.js'

export const formatSql = sql => format(sql, { language: 'tsql' })

export default (sql, name, force = false) => {
  const timestamp = new Date().toISOString()

  if (LOG_SQL_QUERIES || force) {
    try {
      logger.info(timestamp, `\n\n===== SQL # ${name || 'anonymous'}`, `\n${formatSql(sql)}\n`)
    } catch (error) {
      logger.error('Unable to format SQL (I think this is a bug with the sql-formatter library)')
      logger.info(sql)
    }
  } else {
    logger.info(timestamp, `===== SQL # ${name || 'anonymous'}`)
  }
}
