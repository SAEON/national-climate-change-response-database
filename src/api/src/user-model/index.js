import ensureAuthenticated from './_ensure-authenticated.js'
import ensurePermission from './_ensure-permission.js'

export default {
  info: ctx => ctx.userInfo,
  ensureAuthenticated: ctx => ensureAuthenticated(ctx),
  ensurePermission: ({ ctx, permission, validTenants }) =>
    ensurePermission(ctx, validTenants, permission),
  ensurePermissions: ({ ctx, permissions, validTenants }) =>
    ensurePermission(ctx, validTenants, ...permissions),
}
