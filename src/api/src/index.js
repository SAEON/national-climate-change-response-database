import './lib/native-extensions.js'
import './lib/log-config.js'
import { createServer } from 'http'
import Koa from 'koa'
import serve from 'koa-static'
import mount from 'koa-mount'
import KoaRouter from '@koa/router'
import koaCompress from 'koa-compress'
import koaBody from 'koa-bodyparser'
import formidable from 'koa2-formidable'
import koaSession from 'koa-session'
import koaPassport from 'koa-passport'
import zlib from 'zlib'
import createRequestContext from './middleware/create-request-context.js'
import cors from './middleware/cors.js'
import clientSession from './middleware/client-session.js'
import whitelistRoutes from './middleware/whitelist-routes.js'
import blacklistRoutes from './middleware/blacklist-routes.js'
import logReqDetails from './middleware/log-req-details.js'
import fourOFour from './middleware/404.js'
import clientContextRoute from './http/client-context/index.js'
import authenticateRoute from './http/authenticate.js'
import createTenantRoute from './http/create-tenant/index.js'
import publicImageRoute from './http/public-image/index.js'
import logoutRoute from './http/logout.js'
import loginSuccessRoute from './http/login-success.js'
import uploadTemplateRoute from './http/upload-template.js'
import attachFileToSubmission from './http/attach-file-to-submission.js'
import submitCompletedTemplates from './http/submit-completed-templates/index.js'
import downloadTemplateRoute from './http/download-template.js'
import downloadSubmission from './http/download-submission/index.js'
import apolloServer from './graphql/index.js'
import configureSaeonAuth from './passport/saeon-auth/index.js'
import { NCCRD_PORT, NCCRD_API_KEY, NCCRD_SSL_ENV } from './config.js'
import hoursToMilliseconds from './lib/hours-to-ms.js'
import getCurrentDirectory from './lib/get-current-directory.js'
import path from 'path'
import './mssql/setup-db.js'

const __dirname = getCurrentDirectory(import.meta)

// Configure passport authentication
const { login: saeonLogin, authenticate: saeonAuthenticate } = configureSaeonAuth()

// Configure static files server
const SPA_PATH = path.join(__dirname, 'client-dist')
const reactClient = new Koa()
reactClient.use(serve(SPA_PATH))

const staticSpaMiddleware = async (ctx, next) => {
  try {
    return await serve(SPA_PATH)(Object.assign(ctx, { path: 'index.html' }), next)
  } catch (error) {
    console.error('Error setting up static SPA middleware', error)
  }
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
  .use(formidable())
  .use(koaBody())
  .use(async (ctx, next) =>
    koaSession(
      {
        key: 'koa.sess',
        maxAge: hoursToMilliseconds(12),
        autoCommit: true,
        overwrite: true,
        httpOnly: true,
        signed: true,
        rolling: true,
        renew: false,
        secure: NCCRD_SSL_ENV === 'development' ? false : true,
        sameSite: NCCRD_SSL_ENV === 'development' ? 'lax' : 'none',
      },
      app
    )(ctx, next)
  )
  .use(cors(app))
  .use(logReqDetails)
  .use(clientSession)
  .use(koaPassport.initialize())
  .use(koaPassport.session())
  .use(createRequestContext(app))
  .use(
    new KoaRouter()
      .get('/http/client-context', clientContextRoute)
      .get('/http/authenticate/redirect/saeon', saeonAuthenticate, loginSuccessRoute) // passport
      .get('/http/login', saeonLogin) // passport
      .get('/http/authenticate', authenticateRoute)
      .get('/http/public-image/:name', publicImageRoute)
      .get('/http/logout', logoutRoute)
      .post('/http/upload-template', uploadTemplateRoute)
      .post('/http/attach-file-to-submission', attachFileToSubmission)
      .post('/http/submit-completed-templates', submitCompletedTemplates)
      .put('/http/create-tenant', createTenantRoute)
      .get('/http/download-template', downloadTemplateRoute)
      .get('/http/download-submission', downloadSubmission)
      .routes()
  )
  .use(fourOFour)
  .use(mount('/', reactClient))
  .use(blacklistRoutes(staticSpaMiddleware, '/http', '/graphql')) // Resolve all paths to the React.js entry (SPA)

// Configure HTTP server
const httpServer = createServer(app.callback())

// Configure Apollo server
apolloServer
  .start()
  .then(() => apolloServer.applyMiddleware({ app: app, cors: false }))
  .catch(error => console.error('Unable to start Apollo server', error))

// Start public HTTP server
httpServer.listen(NCCRD_PORT, () => {
  console.info(`NCCRD API server ready`)
  console.info(`NCCRD GraphQL server ready`)
  console.info(`NCCRD GraphQL subscriptions server ready`)
})
