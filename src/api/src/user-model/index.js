import ensureRole from './_ensure-role.js'
import ensureAuthenticated from './_ensure-authenticated.js'
import ensurePermission from './_ensure-permission.js'

export const ROLES = {
  dffe: 'dffe',
  admin: 'admin',
  public: 'public',
}

export const PERMISSIONS = {
  createProject: 'create-project',
}

export default {
  // User info
  info: ({ userInfo }) => userInfo,

  // Authentication
  ensureAuthenticated: ctx => ensureAuthenticated(ctx),

  // Role-based authorization
  ensureRole: ({ ctx, role }) => ensureRole(ctx, role),
  ensureDffe: ctx => ensureRole(ctx, ROLES.dffe),
  ensureAdmin: ctx => ensureRole(ctx, ROLES.admin),

  // Permission-based authorization
  ensurePermission: ({ ctx, permission }) => ensurePermission(ctx, permission),
}
