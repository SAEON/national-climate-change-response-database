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
import query from './_query.js'
import { stringify } from 'csv'

const filepath = join(MIGRATION_LOGS_DIRECTORY, 'find-and-try-fix-submission-vocabularies.csv')

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

export default async () => {
  // Delete the output CSV
  await unlink(filepath).catch(() => null)

  // Re-instantiate the blank CSV with headers
  await appendToCsv({ filepath, data: [['ID', 'Title', 'URL', 'Field', 'Incorrect term']] })

  /**
   * Identify submissions where submissionStatus
   * is not a correct term as defined in the
   * vocabulary tree
   */
  await appendToCsv({
    filepath,
    data: (
      await (await pool.connect()).request().query(
        `select
          id,
          json_value(s.project, '$.title') Title,
          concat('${HOSTNAME}/submissions/', id) [URL],
          'submissionStatus' Field,
          json_value(s.submissionStatus, '$.term') [Incorrect term]
        from Submissions s
        where
          s.isSubmitted = 1
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
        filepath,
        data: await query('project', {
          field,
          kind: projectInputFields[field].kind,
          tree,
        }),
      })
    } catch (error) {
      console.error(`QUERY ERROR (project). key: ${field}. tree: ${tree}`, error.message)
    }
  }

  /**
   * Identify mitigation details vocabulary fields with incorrect terms
   */
  for (const field of mitigationVocabularyFields) {
    const tree = mitigationVocabularyFieldsTreeMap[field]
    try {
      await appendToCsv({
        filepath,
        data: await query('mitigation', {
          field,
          kind: mitigationInputFields[field].kind,
          tree,
        }),
      })
    } catch (error) {
      console.error(`QUERY ERROR (mitigation). key: ${field}. tree: ${tree}`, error.message)
    }
  }

  /**
   * Identify adaptation details vocabulary fields with incorrect terms
   */
  for (const field of adaptationVocabularyFields) {
    const tree = adaptationVocabularyFieldsTreeMap[field]
    try {
      await appendToCsv({
        filepath,
        data: await query('adaptation', {
          field,
          kind: adaptationInputFields[field].kind,
          tree,
        }),
      })
    } catch (error) {
      console.error(`QUERY ERROR (adaptation). key: ${field}. tree: ${tree}`, error.message)
    }
  }
}
