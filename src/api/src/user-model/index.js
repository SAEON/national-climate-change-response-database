import ensureRole from './_ensure-role.js'
import ensureAuthenticated from './_ensure-authenticated.js'

const ROLES = {
  datascientist: 'datascientist',
  admin: 'admin',
}

export default {
  ensureAuthenticated: ctx => ensureAuthenticated(ctx),
  ensureDataScientist: ctx => ensureRole(ctx, ROLES.datascientist),
  ensureAdmin: ctx => ensureRole(ctx, ROLES.admin),
}
