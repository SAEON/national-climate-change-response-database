import { createReadStream, createWriteStream } from 'fs'
import { join, normalize, sep } from 'path'
import { UPLOADS_DIRECTORY } from '../../config.js'
import ensureDirectory from '../../lib/ensure-directory.js'
import xlsx from 'xlsx-populate'
import { nanoid } from 'nanoid'
import createUserInputIterator from '../../lib/xlsx/user-input-iterator/index.js'
import createCompileSheetIterator from '../../lib/xlsx/compile-sheet-iterator/index.js'
import saveSubmission from './_save-submission.js'

const MAX_UPLOAD_SIZE_MB = 20

export const _COMPILE_SHEET = '_Compile'
export const _COMPILE_TOP_LEFT = 'A3'
export const _COMPILE_BOTTOM_RIGHT = `I111`

export default async ctx => {
  const { PERMISSIONS, user } = ctx
  const { ensurePermission } = user
  await ensurePermission({ ctx, permission: PERMISSIONS.createSubmission })

  const result = {
    inserted: [],
  }

  const { path, name, size: sizeInBytes } = ctx.request.files['submit-completed-templates']
  const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2)

  try {
    if (sizeInMB > MAX_UPLOAD_SIZE_MB) {
      throw new Error(`Max upload size (${MAX_UPLOAD_SIZE_MB}MB) exceeded`)
    }

    const submissionDirectory = normalize(
      join(UPLOADS_DIRECTORY, `.${sep}excel-submission`, `.${sep}${nanoid()}`)
    )
    await ensureDirectory(submissionDirectory)
    const filePath = normalize(join(submissionDirectory, `.${sep}${name}`))

    const readStream = createReadStream(path)
    const writeStream = createWriteStream(filePath)

    await new Promise((resolve, reject) => {
      readStream.pipe(writeStream).on('finish', () => resolve())
      readStream.on('error', error => reject(error))
      writeStream.on('error', error => reject(error))
    })

    /**
     * Open the workbook
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
     * Save the submissions in the workbook
     * to the database
     */
    let forms = createUserInputIterator(valueSheet, valueRowStart, maxColNumber, columnMap)()
    while (!forms.done) {
      const { submission } = forms
      result.inserted.push(await saveSubmission(user.info(ctx).id, submission))
      forms = forms.next()
    }

    ctx.response.status = 201
    ctx.body = JSON.stringify(result)
  } catch (error) {
    console.error('Error parsing Excel submission', error.message)
    ctx.response.status = 404
    ctx.body = error.message
  }
}
