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
import whitelistRoutes from './middleware/whitelist-routes.js'
import blacklistRoutes from './middleware/blacklist-routes.js'
import logReqDetails from './middleware/log-req-details.js'
import fourOFour from './middleware/404.js'
import apolloServer from './graphql/index.js'
import { PORT, API_KEY, SSL_ENV } from './config/index.js'
import hoursToMilliseconds from './lib/hours-to-ms.js'
import getCurrentDirectory from './lib/get-current-directory.js'
import path from 'path'
import {
  authenticateRoute,
  createTenantRoute,
  publicImageRoute,
  loginRoute,
  loginSuccessRoute,
  logoutRoute,
  oauthAuthenticationCallbackRoute,
  attachFileToSubmissionRoute,
  submitCompletedTemplatesRoute,
  downloadExcelSubmissionTemplateRoute,
  downloadPublicFileRoute,
  downloadSubmissionsRoute,
  downloadFlaggedVocabulariesRoute,
} from './http/index.js'

/**
 * Authentication clients are
 * created from DB entries. So
 * these need to exist first
 */
import('./mssql/setup-db.js')
  .then(({ default: fn }) => fn())
  .catch(error => {
    console.error(error.message)
    process.exit(1)
  })
  .then(() => import('./passport/index.js'))

const __dirname = getCurrentDirectory(import.meta)

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
app.keys = [API_KEY]
app.proxy = true
app
  .use(async (ctx, next) => {
    return koaSession(
      {
        key: 'koa.session',
        maxAge: hoursToMilliseconds(12),
        autoCommit: true,
        overwrite: false,
        httpOnly: true,
        signed: true,
        rolling: false,
        renew: false,
        secure: SSL_ENV === 'development' ? false : true,
        sameSite: SSL_ENV === 'development' ? 'lax' : 'none',
      },
      app
    )(ctx, next)
  })
  .use(cors(app))
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
  .use(koaPassport.initialize())
  .use(koaPassport.session())
  .use(logReqDetails)
  .use(createRequestContext(app))
  .use(
    new KoaRouter()
      .get('/http/authenticate/redirect/saeon', oauthAuthenticationCallbackRoute, loginSuccessRoute) // passport
      .get('/http/login', loginRoute) // passport
      .get('/http/authenticate', authenticateRoute)
      .get('/http/public-image/:name', publicImageRoute)
      .get('/http/logout', logoutRoute)
      .post('/http/attach-file-to-submission', attachFileToSubmissionRoute)
      .post('/http/submit-completed-templates', submitCompletedTemplatesRoute)
      .put('/http/create-tenant', createTenantRoute)
      .get('/http/download-template', downloadExcelSubmissionTemplateRoute)
      .get('/http/download-public-file', downloadPublicFileRoute)
      .get('/http/download-flagged-vocabularies', downloadFlaggedVocabulariesRoute)
      .post('/http/download-submissions', downloadSubmissionsRoute)
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
httpServer.listen(PORT, () => {
  console.info(`NCCRD API server ready`)
  console.info(`NCCRD GraphQL server ready`)
  console.info(`NCCRD GraphQL subscriptions server ready`)
})
