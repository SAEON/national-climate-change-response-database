import { join, normalize, sep } from 'path'
import getCurrentDirectory from '../../lib/get-current-directory.js'
import xlsx from 'xlsx-populate'
import {
  generalDetails as projectFormLayout,
  mitigationDetails as mitigationFormLayout,
  adaptationDetails as adaptationFormLayout,
} from '../../graphql/resolvers/types/form-layout/layout-config.js'
import {
  projectInputFields,
  adaptationInputFields,
  mitigationInputFields,
} from '../../graphql/schema/index.js'
import populateForms from './_populate-forms.js'
import populateTables from './populate-tables/index.js'

const TEMPLATE_NAME = 'base.xlsm'
const GENERAL_DETAILS_SHEETNAME = 'General project details'
const MITIGATION_DETAILS_SHEETNAME = 'Mitigation details'
const ADAPTATION_DETAILS_SHEETNAME = 'Adaptation details'
const PROGRESS_DATA_SHEETS = 'Progress tables'

const excludedFields = {
  [GENERAL_DETAILS_SHEETNAME]: ['__submissionStatus', '__submissionComments'],
  [MITIGATION_DETAILS_SHEETNAME]: [],
  [ADAPTATION_DETAILS_SHEETNAME]: [],
}

const __dirname = getCurrentDirectory(import.meta)
const baseTemplatePath = normalize(join(__dirname, `.${sep}${TEMPLATE_NAME}`))

export default async ctx => {
  // Open the xlsx file
  const workbook = await xlsx.fromFileAsync(baseTemplatePath)

  // GENERAL DETAILS
  populateForms({
    workbook,
    name: GENERAL_DETAILS_SHEETNAME,
    title: GENERAL_DETAILS_SHEETNAME.toUpperCase(),
    formLayout: projectFormLayout,
    inputFields: projectInputFields,
    blacklistFields: excludedFields[GENERAL_DETAILS_SHEETNAME],
  })

  // MITIGATION DETAILS
  populateForms({
    workbook,
    name: MITIGATION_DETAILS_SHEETNAME,
    title: MITIGATION_DETAILS_SHEETNAME.toUpperCase(),
    formLayout: mitigationFormLayout,
    inputFields: mitigationInputFields,
    blacklistFields: excludedFields[MITIGATION_DETAILS_SHEETNAME],
    defaultContent: {
      fileUploads: 'Create or edit submissions online to use this feature',
      progressData:
        "Please add progres data to the appropriate tables on the 'Progress tables' sheet",
    },
  })

  // ADAPTATION DETAILS
  populateForms({
    workbook,
    name: ADAPTATION_DETAILS_SHEETNAME,
    title: ADAPTATION_DETAILS_SHEETNAME.toUpperCase(),
    formLayout: adaptationFormLayout,
    inputFields: adaptationInputFields,
    blacklistFields: excludedFields[ADAPTATION_DETAILS_SHEETNAME],
    defaultContent: {
      fileUploads: 'Create or edit submissions online to use this feature',
      progressData:
        "Please add progres data to the appropriate tables on the 'Progress tables' sheet",
    },
  })

  // PROGRESS TABLES

  populateTables({
    workbook,
    name: PROGRESS_DATA_SHEETS,
  })

  // Send the file back to the client as a download
  ctx.body = await workbook.outputAsync()
  ctx.attachment(`ccrd-template-${new Date().toISOString()}.xlsm`)
}
