import submissions from './_submissions.js'

export default async ctx => {
  const { user } = ctx
  const { ensurePermission } = user
  await ensurePermission({ ctx, permission: PERMISSIONS['migrate-database'] })

  throw new Error(
    `You probably don't want to run this migration, as it would overwrite any changes made to existing submissions that were previously imported. If you DO want to do this for some reason, you will need to remove this error from the source code and redeploy`
  )

  // eslint-disable-next-line
  await submissions()
}
