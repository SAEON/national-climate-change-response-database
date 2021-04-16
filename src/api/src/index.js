import './lib/log-config.js'
import { createServer } from 'http'
import Koa from 'koa'
import KoaRouter from '@koa/router'
import koaCompress from 'koa-compress'
import koaBody from 'koa-bodyparser'
import koaSession from 'koa-session'
import koaPassport from 'koa-passport'
import zlib from 'zlib'
import createRequestContext from './middleware/create-request-context.js'
import cors from './middleware/cors.js'
import clientSession from './middleware/client-session.js'
import blacklistRoute from './middleware/blacklist-route.js'
import homeRoute from './http/home.js'
import clientInfoRoute from './http/client-info.js'
import authenticateRoute from './http/authenticate.js'
import logoutRoute from './http/logout.js'
import loginSuccessRoute from './http/login-success.js'
import apolloServer from './graphql/index.js'
import configureGoogleAuth from './passport/google-auth/index.js'
import passportCookieConfig from './passport/cookie-config.js'
import { NCCRD_API_ADDRESS_PORT, NCCRD_API_KEY } from './config.js'

// Configure passport authentication
const { login: googleLogin, authenticate: googleAuthenticate } = configureGoogleAuth()

// Configure public app
const publicApp = new Koa()
publicApp.keys = [NCCRD_API_KEY]
publicApp.proxy = true
publicApp
  .use(
    koaCompress({
      threshold: 2048,
      flush: zlib.constants.Z_SYNC_FLUSH,
    })
  )
  .use(koaBody())
  .use(blacklistRoute(koaSession(passportCookieConfig, publicApp), '/proxy'))
  .use(cors)
  .use(clientSession)
  .use(koaPassport.initialize())
  .use(koaPassport.session())
  .use(createRequestContext(publicApp))
  .use(
    new KoaRouter()
      .get('/', homeRoute)
      .post('/', homeRoute)
      .get('/client-info', clientInfoRoute)
      .get('/authenticate/redirect/google', googleAuthenticate, loginSuccessRoute) // passport
      .get('/login/google', googleLogin) // passport
      .get('/authenticate', authenticateRoute)
      .get('/logout', logoutRoute)
      .routes()
  )

// Configure HTTP server
const publicHttpServer = createServer(publicApp.callback())

// Configure Apollo server
apolloServer.applyMiddleware({ app: publicApp })
apolloServer.installSubscriptionHandlers(publicHttpServer)

// Start public HTTP server
publicHttpServer.listen(NCCRD_API_ADDRESS_PORT, () => {
  console.log(`NCCRD API server ready`)
  console.log(`NCCRD GraphQL server ready`)
  console.log(`NCCRD GraphQL subscriptions server ready`)
})
