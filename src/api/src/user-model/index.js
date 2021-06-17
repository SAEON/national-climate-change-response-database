import ensureAuthenticated from './_ensure-authenticated.js'
import ensurePermission from './_ensure-permission.js'

export default {
  info: ({ userInfo }) => userInfo,
  ensureAuthenticated: ctx => ensureAuthenticated(ctx),
  ensurePermission: ({ ctx, permission }) => ensurePermission(ctx, permission),
}
