import ensureAuthenticated from './_ensure-authenticated.js'
import ensurePermission from './_ensure-permission.js'
import _ROLES from './_roles.js'
import _PERMISSIONS from './_permissions.js'

export const ROLES = _ROLES

export const PERMISSIONS = _PERMISSIONS

export default {
  // User info
  info: ({ userInfo }) => userInfo,

  // Authentication
  ensureAuthenticated: ctx => ensureAuthenticated(ctx),

  // Permission-based authorization
  ensurePermission: ({ ctx, permission }) => ensurePermission(ctx, permission),
}
