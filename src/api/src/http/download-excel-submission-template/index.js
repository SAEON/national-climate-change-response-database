import { createReadStream } from 'fs'
import { join, normalize, sep } from 'path'
import getCurrentDirectory from '../../lib/get-current-directory.js'
import PERMISSIONS from '../../user-model/permissions.js'

const __dirname = getCurrentDirectory(import.meta)
const baseTemplatePath = normalize(join(__dirname, `.${sep}base.xlsm`))

export default async ctx => {
  const { user } = ctx
  const { ensurePermission } = user
  await ensurePermission({ ctx, permission: PERMISSIONS['create-submission'] })

  // Stream the file to the client
  ctx.body = createReadStream(baseTemplatePath)
  ctx.attachment(`ccrd-template-${new Date().toISOString()}.xlsm`)
}
