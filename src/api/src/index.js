import './lib/native-extensions.js'
import './lib/log-config.js'
import './mssql/setup-db/index.js'
import { createServer } from 'http'
import Koa from 'koa'
import serve from 'koa-static'
import mount from 'koa-mount'
import KoaRouter from '@koa/router'
import koaCompress from 'koa-compress'
import koaBody from 'koa-bodyparser'
import koaSession from 'koa-session'
import koaPassport from 'koa-passport'
import zlib from 'zlib'
import createRequestContext from './middleware/create-request-context.js'
import cors from './middleware/cors.js'
import clientSession from './middleware/client-session.js'
import whitelistRoutes from './middleware/whitelist-routes.js'
import blacklistRoutes from './middleware/blacklist-routes.js'
import fourOfour from './middleware/404.js'
import clientInfoRoute from './http/client-info.js'
import authenticateRoute from './http/authenticate.js'
import logoutRoute from './http/logout.js'
import loginSuccessRoute from './http/login-success.js'
import apolloServer from './graphql/index.js'
import configureGoogleAuth from './passport/google-auth/index.js'
import passportCookieConfig from './passport/cookie-config.js'
import { NCCRD_API_ADDRESS_PORT, NCCRD_API_KEY } from './config.js'
import getCurrentDirectory from './lib/get-current-directory.js'
import path from 'path'

const __dirname = getCurrentDirectory(import.meta)

// Configure passport authentication
const { login: googleLogin, authenticate: googleAuthenticate } = configureGoogleAuth()

// Configure static files server
const SPA_PATH = path.join(__dirname, 'http/web/dist')
const reactClient = new Koa()
reactClient.use(serve(SPA_PATH))

const staticSpaMiddleware = async (ctx, next) => {
  return await serve(SPA_PATH)(Object.assign(ctx, { path: 'index.html' }), next)
}

// Configure api
const app = new Koa()
app.keys = [NCCRD_API_KEY]
app.proxy = true
app
  .use(
    whitelistRoutes(
      koaCompress({
        threshold: 2048,
        flush: zlib.constants.Z_SYNC_FLUSH,
      }),
      '/http',
      '/graphql'
    )
  ) // Only compress the http / graphql api responses
  .use(koaBody())
  .use(koaSession(passportCookieConfig, app))
  .use(cors)
  .use(clientSession)
  .use(koaPassport.initialize())
  .use(koaPassport.session())
  .use(createRequestContext(app))
  .use(
    new KoaRouter()
      .get('/http/client-info', clientInfoRoute)
      .get('/http/authenticate/redirect/google', googleAuthenticate, loginSuccessRoute) // passport
      .get('/http/login/google', googleLogin) // passport
      .get('/http/authenticate', authenticateRoute)
      .get('/http/logout', logoutRoute)
      .routes()
  )
  .use(fourOfour)
  .use(mount('/', reactClient))
  .use(blacklistRoutes(staticSpaMiddleware, '/http', '/graphql')) // Resolve all paths to the React.js entry (SPA)

// Configure HTTP server
const httpServer = createServer(app.callback())

// Configure Apollo server
apolloServer.applyMiddleware({ app: app })
apolloServer.installSubscriptionHandlers(httpServer)

// Start public HTTP server
httpServer.listen(NCCRD_API_ADDRESS_PORT, () => {
  console.log(`NCCRD API server ready`)
  console.log(`NCCRD GraphQL server ready`)
  console.log(`NCCRD GraphQL subscriptions server ready`)
})
