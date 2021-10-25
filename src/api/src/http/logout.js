import { NCCRD_HOSTNAME, SAEON_AUTH_LOGOUT_REDIRECT_ADDRESS } from '../config.js'
import logSql from '../lib/log-sql.js'

export default async ctx => {
  /**
   * User is already logged out
   */
  if (ctx.session.isNew) {
    return ctx.redirect(NCCRD_HOSTNAME)
  }

  /**
   * Otherwise log user out of Oauth2 server
   */
  try {
    const { user, mssql } = ctx
    const userId = user.info(ctx).id
    const { query } = mssql
    const sql = `select id_token from Users where id = '${sanitizeSqlValue(userId)}'`
    logSql(sql, 'User', true)
    const response = await query(sql)
    const { id_token } = response.recordset[0]
    ctx.session = null
    return ctx.redirect(
      `${SAEON_AUTH_LOGOUT_REDIRECT_ADDRESS}?id_token_hint=${id_token}&post_logout_redirect_uri=${NCCRD_HOSTNAME}/http/logout`
    )
  } catch (error) {
    ctx.session = null
    return ctx.redirect(`${SAEON_AUTH_LOGOUT_REDIRECT_ADDRESS}`)
  }
}
