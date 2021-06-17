import { createReadStream, createWriteStream } from 'fs'
import { join } from 'path'
import getCurrentDirectory from '../lib/get-current-directory.js'

const __dirname = getCurrentDirectory(import.meta)

export default async ctx => {
  const { PERMISSIONS, user } = ctx
  const { ensurePermission } = user
  await ensurePermission({ ctx, permission: PERMISSIONS.uploadTemplate })

  const { path, name, type } = ctx.request.files['project-upload-excel-template']
  const read = createReadStream(path)
  const write = createWriteStream(join(__dirname, './text.xlsx'))
  read.pipe(write)

  read.on('error', () => console.log('Read error'))
  write.on('error', error => console.log('Write error', error))

  ctx.body = 'success'
}
