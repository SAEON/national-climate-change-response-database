import { format } from 'sql-formatter'

export default (sql, name) => {
  console.info(`\nSQL Query # ${name || 'anonymous'}`, `\n\n${format(sql, { language: 'tsql' })}\n`)
}
