import packageJson from '../../package.json'

export default async (ctx, next) => {
  try {
    await next()
    const status = ctx.status || 404
    if (status === 404) {
      ctx.throw(404)
    }
  } catch (err) {
    ctx.status = err.status || 500
    ctx.body = `${packageJson.name}, v${packageJson.version}\n\n404\n\nWelcome to the NCCRD API. There is no resource at this path - if you are trying to serve the React App on the route API path, please look at the README file in api/src/http/web.`
  }
}
