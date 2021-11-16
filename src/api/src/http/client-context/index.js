import { NCCRD_HOSTNAME } from '../../config.js'
import { pool } from '../../mssql/pool.js'

export default async ctx => {
  const ipAddress = ctx.request.headers['X-Real-IP'] || ctx.request.ip
  const userAgent = ctx.request.headers['user-agent']
  const origin = ctx.request.headers['origin'] || NCCRD_HOSTNAME

  const theme = (
    await (await pool.connect())
      .request()
      .input('name', 'default')
      .query(`select theme from MuiThemes where name = @name;`)
  ).recordset[0].theme

  ctx.body = {
    ipAddress,
    userAgent,
    origin,
    theme,
  }
}
