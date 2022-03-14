import { pool } from '../mssql/pool.js'
import passport from 'koa-passport'
import { Issuer } from 'openid-client'
import {
  ODP_AUTH_CLIENT_SECRET,
  ODP_AUTH_CLIENT_ID,
  ODP_AUTH_WELL_KNOWN,
  HOSTNAME,
  ODP_AUTH_REDIRECT_PATH,
} from '../config/index.js'
import strategy from './_strategy.js'
import './_serialize-user.js'
import './_deserialize-user.js'
const { port, protocol } = new URL(HOSTNAME)

if (!ODP_AUTH_CLIENT_ID || !ODP_AUTH_CLIENT_SECRET) {
  console.error('OAUTH credentials not provided')
  process.exit(1)
}

/**
 * Each tenant needs it's own authentication client
 * This is configured on startup, so when a tenant
 * is added to the deployment, restart the app
 */

export default async () => {
  const issuer = await Issuer.discover(ODP_AUTH_WELL_KNOWN)

  const tenants = (
    await (await pool.connect()).request().query(`select hostname from Tenants;`)
  ).recordset.map(({ hostname }) => [
    hostname,
    `${protocol}//${hostname}${port ? `:${port}` : ''}${ODP_AUTH_REDIRECT_PATH}`,
  ])

  tenants.forEach(([id, cbUri]) => {
    passport.use(id, strategy({ issuer, redirect_uri: cbUri }))
  })

  console.info('Authentication configured successfully')
}
