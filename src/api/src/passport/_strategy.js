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

      try {
        const transaction = new mssql.Transaction(await pool.connect())
        await transaction.begin()

        // Create/retrieve user
        await transaction
          .request()
          .input('emailAddress', emailAddress)
          .input('saeonId', name)
          .input('name', saeonId)
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
            insert into UserRoleXref (userId, roleId)
            select distinct
              u.id userId,
              ( select id from Roles r where r.name =  @roleName) roleId
            from Users u
            where
              u.emailAddress = @emailAddress
              and not exists (
                select 1
                from UserRoleXref
                where userId = u.id
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
        cb(error, null)
      }
    }
  )
}