import ensureAuthenticated from './_ensure-authenticated.js'
import ensurePermission from './_ensure-permission.js'

export const ROLES = {
  dffe: 'dffe',
  admin: 'admin',
  public: 'public',
}

export const PERMISSIONS = {
  // API routes
  createProject: 'create-project',
  viewPermissions: 'view-permissions',
  viewRoles: 'view-roles',
  viewUsers: 'view-users',

  // UI routes
  'view/Access': 'view-/access',
  'view/Deployments': 'view-/deployments',
}

export default {
  // User info
  info: ({ userInfo }) => userInfo,

  // Authentication
  ensureAuthenticated: ctx => ensureAuthenticated(ctx),

  // Permission-based authorization
  ensurePermission: ({ ctx, permission }) => ensurePermission(ctx, permission),
}
