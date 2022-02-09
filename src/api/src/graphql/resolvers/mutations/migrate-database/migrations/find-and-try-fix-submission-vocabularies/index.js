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
import { MIGRATION_LOGS_DIRECTORY } from '../../../../../../config/index.js'
import { pool } from '../../../../../../mssql/pool.js'
import { join } from 'path'
import { appendFile, unlink } from 'fs/promises'
import query from './_query.js'

const filepath = join(MIGRATION_LOGS_DIRECTORY, 'find-and-try-fix-submission-vocabularies.txt')

export default async () => {
  // Delete the log file
  await unlink(filepath).catch(() => null)

  /**
   * Update submissionStatus to default value
   * where it is currently null
   */

  await (await pool.connect()).request().query(`
    update Submissions
    set
      submissionStatus = '{"term": "Pending"}'
    where
      submissionStatus is null;`)

  /**
   * Identify submissions where submissionStatus
   * is not a correct term as defined in the
   * vocabulary tree
   */
  await appendFile(
    filepath,
    `Incorrect submission status:\n${JSON.stringify(
      (
        await (await pool.connect()).request().query(
          `select
            id
          from Submissions s
          where json_value(s.submissionStatus, '$.term') not in (
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
      ).recordset.map(({ id }) => id),
      null,
      2
    )}`
  )

  /**
   * Identify project details vocabulary fields with incorrect terms
   */
  for (const field of projectVocabularyFields) {
    const tree = projectVocabularyFieldsTreeMap[field]
    try {
      const result = await query('project', {
        field,
        kind: projectInputFields[field].kind,
        tree,
      })
      await appendFile(
        filepath,
        `\n\nIncorrect project.${field} vocabularies:\n${JSON.stringify(result, null, 2)}`
      )
    } catch (error) {
      console.error('Query error', 'province', field, tree, error.message)
    }
  }

  /**
   * Identify mitigation details vocabulary fields with incorrect terms
   */
  for (const field of mitigationVocabularyFields) {
    const tree = mitigationVocabularyFieldsTreeMap[field]
    try {
      const result = await query('mitigation', {
        field,
        kind: mitigationInputFields[field].kind,
        tree,
      })
      await appendFile(
        filepath,
        `\n\nIncorrect mitigation.${field} vocabularies:\n${JSON.stringify(result, null, 2)}`
      )
    } catch (error) {
      console.error('Query error', 'mitigation', field, tree, error.message)
    }
  }

  /**
   * Identify adaptation details vocabulary fields with incorrect terms
   */
  for (const field of adaptationVocabularyFields) {
    const tree = adaptationVocabularyFieldsTreeMap[field]
    try {
      const result = await query('adaptation', {
        field,
        kind: adaptationInputFields[field].kind,
        tree,
      })
      await appendFile(
        filepath,
        `\n\nIncorrect adaptation.${field} vocabularies:\n${JSON.stringify(result, null, 2)}`
      )
    } catch (error) {
      console.error('Query error', 'adaptation', field, tree, error.message)
    }
  }
}
