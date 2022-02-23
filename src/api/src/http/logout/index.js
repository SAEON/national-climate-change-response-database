import { HOSTNAME, ODP_AUTH_LOGOUT_REDIRECT } from '../../config/index.js'
import { pool } from '../../mssql/pool.js'

export default async ctx => {
  let REDIRECT_ADDRESS = HOSTNAME
  if (ctx.tenant) {
    const { protocol, port } = new URL(HOSTNAME)
    const { hostname } = ctx.tenant
    REDIRECT_ADDRESS = `${protocol}//${hostname}${port ? `:${port}` : ''}`
  }

  /**
   * User is already logged out
   */
  if (ctx.session.isNew) {
    return ctx.redirect(REDIRECT_ADDRESS)
  }

  /**
   * Otherwise log user out of Oauth2 server
   */
  try {
    const { user } = ctx
    const userId = user.info(ctx).id

    const id_token = await pool
      .connect()
      .then(pool =>
        pool.request().input('id', userId).query('select id_token from Users where id = @id')
      )
      .then(result => result.recordset[0].id_token)

    ctx.session = null
    return ctx.redirect(
      `${ODP_AUTH_LOGOUT_REDIRECT}?id_token_hint=${id_token}&post_logout_redirect_uri=${REDIRECT_ADDRESS}/http/logout`
    )
  } catch (error) {
    console.error('Error logging user out', error)
    ctx.session = null
    return ctx.redirect(`${ODP_AUTH_LOGOUT_REDIRECT}`)
  }
}
