import createSubmissionCsv, {
  csvFilePath,
} from '../../mutations/migrate-database/migrations/find-incorrect-submission-vocabularies/index.js'
import { readFile } from 'fs/promises'
import { parse } from 'csv'

export default async (self, { tenantId }, ctx) => {
  await createSubmissionCsv(ctx, { tenantId })
  const csv = await readFile(csvFilePath)
  return await new Promise((resolve, reject) => {
    parse(
      csv,
      {
        columns: true,
      },
      (error, records) => {
        if (error) {
          reject(error)
        } else {
          resolve(records)
        }
      }
    )
  })
}
