import { pool } from '../mssql/pool.js'
import mssql from 'mssql'
import { Strategy } from 'openid-client'
import {
  ODP_AUTH_CLIENT_SECRET,
  ODP_AUTH_CLIENT_ID,
  ODP_AUTH_LOGOUT_REDIRECT as DEFAULT_LOGOUT_REDIRECT,
} from '../config/index.js'
import { user as userRole } from '../user-model/roles.js'

export default ({ issuer, redirect_uri }) => {
  const client = new issuer.Client({
    client_id: ODP_AUTH_CLIENT_ID,
    client_secret: ODP_AUTH_CLIENT_SECRET,
    redirect_uris: [redirect_uri],
    post_logout_redirect_uris: [DEFAULT_LOGOUT_REDIRECT],
    token_endpoint_auth_method: 'client_secret_post',
    response_types: ['code'],
  })

  return new Strategy(
    {
      client,
      sessionKey: 'oauth-session-key',
      params: {},
      passReqToCallback: true,
      usePKCE: false,
    },
    async (req, tokenSet, userInfo, cb) => {
      const { id_token } = tokenSet
      const { email, sub: saeonId, name } = userInfo
      const emailAddress = email.toLowerCase()

      const transaction = new mssql.Transaction(await pool.connect())
      await transaction.begin()

      try {
        // Create/retrieve user
        await transaction
          .request()
          .input('emailAddress', emailAddress)
          .input('saeonId', saeonId)
          .input('name', name)
          .input('id_token', id_token).query(`
            ;with currentUser as (
              select
              @emailAddress emailAddress,
              @saeonId saeonId,
              @name name,
              @id_token id_token
            )
            
            merge Users as target
            using currentUser as source on target.emailAddress = source.emailAddress
            
            when matched then update
              set
                target.saeonId = source.saeonId,
                target.name = source.name,
                target.id_token = source.id_token
            
            when not matched by target then insert (emailAddress, saeonId, name, id_token)
              values (
                source.emailAddress,
                source.saeonId,
                source.name,
                source.id_token
              );`)

        // Make sure that the user has at least the basic role
        await transaction
          .request()
          .input('emailAddress', emailAddress)
          .input('roleName', userRole.name).query(`
            merge UserXrefRoleXrefTenant t
            using (
              select distinct
                u.id userId,
                ( select id from Roles r where r.name =  @roleName) roleId,
                c.id tenantId
              from Users u
              cross join ( select id from Tenants ) c
              where
                u.emailAddress = @emailAddress
            ) s on
              s.userId = t.userId and
              s.roleId = t.roleId and
              s.tenantId = t.tenantId

            when not matched by target
              then insert (userId, roleId, tenantId)
            values (
              s.userId,
              s.roleId,
              s.tenantId
            );`)

        // Get the user back
        const user = await transaction
          .request()
          .input('emailAddress', emailAddress)
          .query(
            `select
              *
             from Users u
             where
              emailAddress = @emailAddress
             for json auto, without_array_wrapper;`
          )
          .then(({ recordset: r }) => r[0])

        // Commit transaction
        await transaction.commit()

        cb(null, user)
      } catch (error) {
        console.error('Error authenticating user', error)
        await transaction.rollback()
        cb(error, null)
      }
    }
  )
}
