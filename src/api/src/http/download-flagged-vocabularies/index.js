import { createReadStream } from 'fs'
import { basename } from 'path'
import logger from '../../lib/logger.js'
import { csvFilePath } from '../../graphql/resolvers/mutations/migrate-database/migrations/find-incorrect-submission-vocabularies/index.js'

export default async ctx => {
  try {
    // Stream the file to the client
    ctx.body = createReadStream(csvFilePath)
    ctx.attachment(basename(csvFilePath))
  } catch (error) {
    logger.error('Error retrieving submission file', error.message)
    ctx.throw(404)
  }
}
