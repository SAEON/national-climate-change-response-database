export default (fn, p) => async (ctx, next) => {
  if (ctx.request.path.startsWith(p)) {
    return next()
  } else {
    return fn(ctx, next)
  }
}
