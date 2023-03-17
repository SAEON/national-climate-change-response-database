import {
  projectInputFields,
  projectVocabularyFields,
  projectVocabularyFieldsTreeMap,
  mitigationInputFields,
  mitigationVocabularyFields,
  mitigationVocabularyFieldsTreeMap,
  adaptationInputFields,
  adaptationVocabularyFields,
  adaptationVocabularyFieldsTreeMap,
} from '../../../../../schema/index.js'
import { MIGRATION_LOGS_DIRECTORY, HOSTNAME } from '../../../../../../config/index.js'
import { pool } from '../../../../../../mssql/pool.js'
import { join } from 'path'
import { appendFile, unlink } from 'fs/promises'
import query, { DEV_QUERY_LIMIT } from './_query.js'
import { stringify } from 'csv'
import logger from '../../../../../../lib/logger.js'

export const csvFilePath = join(MIGRATION_LOGS_DIRECTORY, 'incorrect-submission-vocabularies.csv')

let isRunning = false

const appendToCsv = async ({ filepath, data }) => {
  await appendFile(
    filepath,
    await new Promise((resolve, reject) =>
      stringify(
        data,
        {
          header: false,
          quoted: true,
        },
        (error, data) => {
          if (error) {
            reject(error)
          } else {
            resolve(data)
          }
        }
      )
    )
  )
}

export default async (ctx, { tenantId }) => {
  if (!tenantId) {
    throw new Error('This migration must be run in the context of a specific tenant')
  }

  if (isRunning) {
    throw new Error(
      'Only one (admin) user is allowed to access this tool per time. Someone else currently using it'
    )
  }

  try {
    isRunning = true

    // Delete the output CSV
    await unlink(csvFilePath).catch(() => null)

    // Re-instantiate the blank CSV with headers
    await appendToCsv({
      filepath: csvFilePath,
      data: [['ID', 'Title', 'URL', 'Field', 'Incorrect term', 'Tree']],
    })

    /**
     * Identify submissions where submissionStatus
     * is not a correct term as defined in the
     * vocabulary tree
     */
    await appendToCsv({
      filepath: csvFilePath,
      data: (
        await (
          await pool.connect()
        )
          .request()
          .input('tenantId', tenantId)
          .input('urlBase', `${HOSTNAME}/submissions/`)
          .query(
            `select ${DEV_QUERY_LIMIT}
              s.id,
              json_value(s.project, '$.title') Title,
              concat(@urlBase, s.id) [URL],
              'submissionStatus' Field,
              json_value(s.submissionStatus, '$.term') [Incorrect term]
            from Submissions s
            join TenantXrefSubmission txs on txs.submissionId = s.id
            where
              txs.tenantId = @tenantId
              and s.isSubmitted = 1
              and s.deletedAt is null
              and json_value(s.submissionStatus, '$.term') not in (
              select
                v.term
              from Trees t
              join VocabularyXrefTree x on x.treeId = t.id
              join VocabularyXrefVocabulary vxv on vxv.childId = x.vocabularyId
              join Vocabulary v on v.id = vxv.childId
              where
                t.name = 'projectValidationStatus'
                and vxv.parentId is not null
            );`
          )
      ).recordset,
    })

    /**
     * Identify project details vocabulary fields with incorrect terms
     */
    for (const field of projectVocabularyFields) {
      const tree = projectVocabularyFieldsTreeMap[field]
      try {
        await appendToCsv({
          filepath: csvFilePath,
          data: await query('project', {
            tenantId,
            field,
            kind: projectInputFields[field].kind,
            tree,
          }),
        })
      } catch (error) {
        logger.error(`QUERY ERROR (project). key: ${field}. tree: ${tree}`, error.message)
      }
    }

    /**
     * Identify mitigation details vocabulary fields with incorrect terms
     */
    for (const field of mitigationVocabularyFields) {
      const tree = mitigationVocabularyFieldsTreeMap[field]
      try {
        await appendToCsv({
          filepath: csvFilePath,
          data: await query('mitigation', {
            tenantId,
            field,
            kind: mitigationInputFields[field].kind,
            tree,
          }),
        })
      } catch (error) {
        logger.error(`QUERY ERROR (mitigation). key: ${field}. tree: ${tree}`, error.message)
      }
    }

    /**
     * Identify adaptation details vocabulary fields with incorrect terms
     */
    for (const field of adaptationVocabularyFields) {
      const tree = adaptationVocabularyFieldsTreeMap[field]
      try {
        await appendToCsv({
          filepath: csvFilePath,
          data: await query('adaptation', {
            tenantId,
            field,
            kind: adaptationInputFields[field].kind,
            tree,
          }),
        })
      } catch (error) {
        logger.error(`QUERY ERROR (adaptation). key: ${field}. tree: ${tree}`, error.message)
      }
    }
  } catch (error) {
    logger.error('Unknown error occurred', error)
  } finally {
    isRunning = false
  }
}
