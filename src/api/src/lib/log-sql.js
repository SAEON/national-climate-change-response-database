import { format } from 'sql-formatter'

export default (sql, name) => {
  console.info(
    `\n===== SQL Query # ${name || 'anonymous'}`,
    `\n\n${format(sql, { language: 'tsql' })}\n`
  )
}
