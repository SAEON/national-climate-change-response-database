import colToLetter from '../col-to-letter.js'
import processMitigation from './process-mitigation/index.js'
import {
  projectVocabularyFields,
  mitigationVocabularyFields,
  adaptationVocabularyFields,
} from '../../../graphql/schema/index.js'

const vocabFields = {
  project: projectVocabularyFields,
  mitigation: mitigationVocabularyFields,
  adaptation: adaptationVocabularyFields,
}

export default (sheet, startRow, maxRight, invertedIndex) => {
  const index = Object.fromEntries(
    Object.entries(invertedIndex)
      .map(([form, fields]) => Object.entries(fields).map(([field, col]) => [col, { field, form }]))
      .flat()
  )

  return function iterate(currentRow = startRow) {
    /**
     * TODO - delete this to release the multiple parsing
     * functionality
     */
    if (currentRow > startRow + 1) {
      throw new Error('Excel parsing limited to single projects')
    }

    const range = sheet.range(`A${currentRow}`, `${colToLetter(maxRight + 1)}${currentRow}`)
    const row = range.cells()[0]

    /**
     * Parsing is done when a row with a
     * blank title is found
     */
    const hasData = Boolean(row[0].value())

    /**
     * Convert submission data
     * into JSON suitable for
     * SQL Server
     */
    const submission = hasData
      ? row
          .map((cell, col) => ({
            form: index[col + 1]?.form,
            field: index[col + 1]?.field,
            value: cell.value(),
          }))
          .filter(({ value }) => value)
          .reduce((submission, { form, field, value }) => {
            /** The Excel form input for vocabulary fields
             * must be parsed to match the input provided
             * by the online form
             */
            if (
              field === 'province' ||
              field === 'districtMunicipality' ||
              field === 'localMunicipality'
            ) {
              value = value.split(',').map(term => ({ term: term.trim() }))
            } else if (vocabFields[form].includes(field)) {
              value = { term: value }
            }

            return Object.assign(
              { ...submission },
              {
                [form]: Object.assign(
                  { ...submission[form] },
                  {
                    [field]: value,
                  }
                ),
              }
            )
          }, {})
      : undefined

    /**
     * The mitigation form needs
     * processing
     */
    if (submission?.mitigation) {
      submission.mitigation = processMitigation(submission.mitigation)
    }

    return {
      next: () => iterate(currentRow + 1),
      submission,
      done: !hasData,
    }
  }
}
