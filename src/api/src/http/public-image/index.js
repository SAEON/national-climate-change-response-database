import { createReadStream } from 'fs'
import { join, sep } from 'path'
import getCurrentDirectory from '../../lib/get-current-directory.js'
import { IMAGES_DIRECTORY } from '../../config.js'
import sanitize from 'sanitize-filename'

const __dirname = getCurrentDirectory(import.meta)

const DEFAULT_IMAGES = ['dffe-logo.jpg', 'sa-flag.jpg']

export default async ctx => {
  const name = sanitize(ctx.params.name)
  console.log('hi', name)

  // If it's a default image, then it's in ./images/
  if (DEFAULT_IMAGES.includes(name)) {
    ctx.body = createReadStream(join(__dirname, `.${sep}images${sep}${name}`))
  }

  // Otherwise it's in the file system
  ctx.body = createReadStream(join(IMAGES_DIRECTORY, `.${sep}${name}`))
}
