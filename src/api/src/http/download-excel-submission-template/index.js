import { join, normalize, sep } from 'path'
import getCurrentDirectory from '../../lib/get-current-directory.js'
import PERMISSIONS from '../../user-model/permissions.js'
import xlsx from 'xlsx-populate'
import { pool } from '../../mssql/pool.js'

const __dirname = getCurrentDirectory(import.meta)
const baseTemplatePath = normalize(join(__dirname, `.${sep}base.xlsm`))

const veryHiddenSheets = ['_Vocabularies', '_VBA', '_Compile']

export default async ctx => {
  const { user } = ctx
  const { ensurePermission } = user
  await ensurePermission({ ctx, permission: PERMISSIONS['create-submission'] })

  // Open the xlsx file
  const workbook = await xlsx.fromFileAsync(baseTemplatePath)

  // Hide sheets
  veryHiddenSheets.forEach(name => {
    workbook.sheet(name).hidden('very')
  })

  // Send the file back to the client as a download
  ctx.body = await workbook.outputAsync()
  ctx.attachment(`ccrd-template-${new Date().toISOString()}.xlsm`)
}
