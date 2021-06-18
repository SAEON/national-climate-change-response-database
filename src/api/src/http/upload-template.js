import { createReadStream, createWriteStream, stat } from 'fs'
import { join, normalize, sep } from 'path'
import { SUBMISSION_TEMPLATES_DIRECTORY } from '../config.js'

export default async ctx => {
  const { PERMISSIONS, user } = ctx
  const { ensurePermission } = user
  await ensurePermission({ ctx, permission: PERMISSIONS.uploadTemplate })

  const { path, name } = ctx.request.files['project-upload-excel-template']
  const filename = normalize(join(SUBMISSION_TEMPLATES_DIRECTORY, `.${sep}${name}`))

  /**
   * The file must not exist. Therefore the stat() fn call
   * MUST fail for this to be a valid upload
   */
  try {
    await new Promise((resolve, reject) => {
      stat(filename, error => {
        if (error) {
          resolve(false)
        } else {
          reject(
            new Error(
              'This file already exists. Please include the upload date in the file name so that versions can be identified uniquely'
            )
          )
        }
      })
    })

    const readStream = createReadStream(path)
    const writeStream = createWriteStream(filename)

    readStream.pipe(writeStream)
    readStream.on('error', () => console.log('Read error'))
    writeStream.on('error', error => console.log('Write error', error))

    ctx.response.status = 201
    ctx.body = 'File upload successful'
  } catch (error) {
    ctx.response.status = 409
    ctx.body = error.message
  }
}
