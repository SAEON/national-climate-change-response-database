import xlsx from 'xlsx-populate'
import { Readable } from 'stream'
import {
  _COMPILE_SHEET,
  _COMPILE_TOP_LEFT,
  _COMPILE_BOTTOM_RIGHT,
} from '../submit-completed-templates/index.js'
import createCompileSheetIterator from '../../lib/xlsx/compile-sheet-iterator/index.js'
import colToLetter from '../../lib/xlsx/col-to-letter.js'
import {
  projectVocabularyFields,
  mitigationVocabularyFields,
  adaptationVocabularyFields,
  projectInputFields,
  mitigationInputFields,
  adaptationInputFields,
} from '../../graphql/schema/index.js'
import parseProgressData from './_parse-progress-data.js'
import PERMISSIONS from '../../user-model/permissions.js'
import mssql from 'mssql'
import { pool } from '../../mssql/pool.js'

const vocabFields = {
  project: projectVocabularyFields,
  mitigation: mitigationVocabularyFields,
  adaptation: adaptationVocabularyFields,
}

export default async ctx => {
  const { user } = ctx
  const { ensurePermission } = user
  await ensurePermission({ ctx, permission: PERMISSIONS['download-submission'] })
  const { id } = ctx.query

  if (!id) {
    ctx.response = 400
    return
  }

  try {
    /**
     * Find most recent template path
     */
    const filePath = await pool
      .connect()
      .then(pool =>
        pool
          .request()
          .query('select top 1 filePath from ExcelSubmissionTemplates order by createdAt desc;')
      )
      .then(result => result.recordset[0].filePath)

    /**
     * Get the submission data
     */
    const submission = await pool
      .connect()
      .then(pool =>
        pool
          .request()
          .input('id', mssql.UniqueIdentifier, id)
          .query(`select * from Submissions where id = @id`)
      )
      .then(result => result.recordset[0])

    if (!submission) {
      throw new Error(`Submission with ID ${id} does not exist`)
    }

    const project = JSON.parse(submission.project)
    const mitigation = JSON.parse(submission.mitigation)
    const adaptation = JSON.parse(submission.adaptation)

    /**
     * Load the Excel template
     */
    const workbook = await xlsx.fromFileAsync(filePath)
    const compileSheet = workbook.sheet(_COMPILE_SHEET)
    const columnMap = {}
    let valueSheet
    let valueRowStart
    let maxColNumber = 0

    /**
     * Get a mapping of field names to column numbers in the Excel sheet
     * TODO - this code is defined twice
     */
    let row = createCompileSheetIterator(compileSheet, _COMPILE_TOP_LEFT, _COMPILE_BOTTOM_RIGHT)()
    while (!row.done) {
      let [form, field, , sheet, headerRowNumber, col] = row.data

      /**
       * Get the sheet that contains the values
       * (This allows for the name of the sheet
       * to be changed)
       */
      if (!valueSheet || !valueRowStart) {
        valueSheet = workbook.sheet(sheet.value())
        valueRowStart = headerRowNumber.value() + 1
      }

      form = form.value()
      if (!columnMap[form]) {
        columnMap[form] = {}
      }

      field = field.value()
      col = col.value()
      columnMap[form][field] = col
      maxColNumber = Math.max(maxColNumber, col)
      row = row.next()
    }

    /**
     * Populate the template (project details)
     */
    const { project: projectExcelCols } = columnMap
    Object.entries(project).forEach(([field, _value]) => {
      const col = projectExcelCols[field]
      if (!col) {
        return
      }
      const valueColLetter = colToLetter(col - 1)
      const valueAddress = `${valueColLetter}${valueRowStart}`

      let value
      if (vocabFields.project.includes(field)) {
        if (projectInputFields[field] === 'LIST') {
          value = _value.map(({ term }) => term).join(', ')
        } else {
          value = _value.term
        }
      } else if (field === 'startYear' || field === 'endYear') {
        value = new Date(_value).getFullYear().toString()
      } else if (field === 'xy') {
        value = _value // TODO
      } else {
        value = _value
      }

      if (value) {
        valueSheet.cell(valueAddress).value(value)
      }
    })

    /**
     * Populate the template (mitigation details)
     */
    const { mitigation: mitigationExcelCols } = columnMap
    Object.entries({ ...mitigation, ...parseProgressData(mitigation?.progressData) }).forEach(
      ([field, _value]) => {
        const col = mitigationExcelCols[field]
        if (!col) {
          return
        }
        const valueColLetter = colToLetter(col - 1)
        const valueAddress = `${valueColLetter}${valueRowStart}`

        let value
        if (vocabFields.mitigation.includes(field)) {
          if (mitigationInputFields[field] === 'LIST') {
            value = _value.map(({ term }) => term).join(', ')
          } else {
            value = _value.term
          }
        } else if (field === 'xy') {
          value = 'TODO'
        } else {
          value = _value
        }

        if (value) {
          valueSheet.cell(valueAddress).value(value)
        }
      }
    )

    /**
     * Populate the template (adaptation details)
     */
    const { adaptation: adaptationExcelCols } = columnMap
    Object.entries(adaptation).forEach(([field, _value]) => {
      const col = adaptationExcelCols[field]
      if (!col) {
        return
      }
      const valueColLetter = colToLetter(col - 1)
      const valueAddress = `${valueColLetter}${valueRowStart}`

      let value
      if (vocabFields.adaptation.includes(field)) {
        if (adaptationInputFields[field] === 'LIST') {
          value = _value.map(({ term }) => term).join(', ')
        } else {
          value = _value.term
        }
      } else if (field === 'xy') {
        value = 'TODO'
      } else {
        value = _value
      }

      if (value) {
        valueSheet.cell(valueAddress).value(value)
      }
    })

    /**
     * Send the file as a download
     *
     * I THINK this is a good idea...
     * https://stackoverflow.com/a/44091532/3114742
     *
     * alternatively, just
     * ctx.body = await workbook.outputAsync()
     */
    const data = await workbook.outputAsync()
    const dataStream = new Readable()
    dataStream._read = () => {}
    dataStream.push(data)
    dataStream.push(null)
    ctx.body = dataStream
    ctx.attachment(`${project.title || id}.xlsm`)
  } catch (error) {
    console.error(error.message)
    ctx.response.status = 404
  }
}
