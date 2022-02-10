import PERMISSIONS from '../user-model/permissions.js'
import { createReadStream } from 'fs'
import { basename } from 'path'

import { csvFilePath } from '../graphql/resolvers/mutations/migrate-database/migrations/find-incorrect-submission-vocabularies/index.js'

export default async ctx => {
  const { user } = ctx
  const { ensurePermission } = user
  await ensurePermission({ ctx, permission: PERMISSIONS['migrate-database'] })

  try {
    // Stream the file to the client
    ctx.body = createReadStream(csvFilePath)
    ctx.attachment(basename(csvFilePath))
  } catch (error) {
    console.error('Error retrieving submission file', error.message)
    ctx.throw(404)
  }
}
