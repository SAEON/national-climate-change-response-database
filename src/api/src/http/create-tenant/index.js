import PERMISSIONS from '../../user-model/permissions.js'

export default async ctx => {
  const { user } = ctx
  const { ensurePermission } = user
  await ensurePermission({ ctx, permission: PERMISSIONS['create-tenant'] })

  const { hostname, title, flag, logo, shapefiles, theme } = ctx.request.body

  ctx.body = 'okay'
}
