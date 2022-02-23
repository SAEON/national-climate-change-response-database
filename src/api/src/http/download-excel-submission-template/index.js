import { join, normalize, sep } from 'path'
import getCurrentDirectory from '../../lib/get-current-directory.js'
import xlsx from 'xlsx-populate'
import { pool } from '../../mssql/pool.js'
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
import col2Letter from '../../lib/xlsx/col-to-letter.js'

const __dirname = getCurrentDirectory(import.meta)
const baseTemplatePath = normalize(join(__dirname, `.${sep}base.xlsm`))

const submissionsSheet = 'Submissions'
const formLayoutSheet = '_FormLayout'
const vocabularySheet = '_Vocabularies'
const fieldDefinitionSheet = '_FieldDefinitions'
const veryHiddenSheets = [
  vocabularySheet,
  '_VBA',
  '_Compile',
  fieldDefinitionSheet,
  formLayoutSheet,
]

const addFieldDefs = ({ sheet, fields, range, title }) => {
  const [startCol, endCol] = range.split(':')
  sheet
    .range(`${startCol}1:${endCol}1`)
    .merged(true)
    .value([[title]])
    .style('horizontalAlignment', 'center')
  sheet
    .range(`${startCol}2:${endCol}2`)
    .value([['Field', 'Label', 'description', 'Type', 'Vocabulary Tree']])
  Object.entries(fields).forEach(([fieldName, { kind, description: _description }], i) => {
    const [label, description, vocabularyTree] = _description.split('::')
    sheet
      .range(`${startCol}${i + 3}:${endCol}${i + 3}`)
      .value([[fieldName, label, description || '', kind, vocabularyTree || '']])
  })
}

export default async ctx => {
  /**
   * Make the vocabulary trees
   */

  const fragments = (
    await (
      await pool.connect()
    ).query(`
      ;with fragments as (
        select
          t.[name] tree,
          v.id,
          v.term,
          case
            when ( select parentId from VocabularyXrefVocabulary x where x.childId = v.id and x.treeId = t.id ) is null then 1
            else 0
          end isRoot,
          ( select ( select childId id from VocabularyXrefVocabulary where parentId = v.id for json path ) children
            for json path, without_array_wrapper ) fragment
        from Trees t
        join VocabularyXrefTree vxt on vxt.treeId = t.id
        join Vocabulary v on v.id = vxt.vocabularyId
      )
      
      select
        tree [name],
        id,
        term,
        isRoot,
        fragment tree
      from fragments;`)
  ).recordset

  const trees = fragments
    .filter(({ isRoot }) => Boolean(isRoot))
    .reduce(
      (trees, fragment) => ({
        ...trees,
        [fragment.name]: (function extendTree({ parent, children = [], fragments }) {
          return {
            ...parent,
            children: children.map(({ id }) => {
              const fragment = fragments.find(({ id: parentId }) => id === parentId)
              return extendTree({
                parent: { id, term: fragment.term },
                children: JSON.parse(fragment.tree).children,
                fragments,
              })
            }),
          }
        })({
          parent: {
            id: fragment.id,
            term: fragment.term,
          },
          children: JSON.parse(fragment.tree).children,
          fragments,
        }),
      }),
      {}
    )

  // Open the xlsx file
  const workbook = await xlsx.fromFileAsync(baseTemplatePath)

  /**
   * Set the field type definitions
   */

  // Project
  addFieldDefs({
    sheet: workbook.sheet(fieldDefinitionSheet),
    fields: projectInputFields,
    range: 'A:E',
    title: 'Project',
  })

  // Mitigation
  addFieldDefs({
    sheet: workbook.sheet(fieldDefinitionSheet),
    fields: mitigationInputFields,
    range: 'F:J',
    title: 'Mitigation',
  })

  // Adaptation
  addFieldDefs({
    sheet: workbook.sheet(fieldDefinitionSheet),
    fields: adaptationInputFields,
    range: 'K:O',
    title: 'Adaptation',
  })

  // Write the trees to the Excel template
  Object.entries(trees).forEach(([name, tree], i) => {
    workbook
      .sheet(vocabularySheet)
      .range(`${col2Letter(i)}1:${col2Letter(i)}2`)
      .value([[name], [JSON.stringify(tree)]])
  })

  // Write the form layout configuration to the Excel template
  workbook
    .sheet(formLayoutSheet)
    .range(`A1:C2`)
    .value([
      ['Project', 'Mitigation', 'Adaptation'],
      [
        JSON.stringify(projectFormLayout),
        JSON.stringify(mitigationFormLayout),
        JSON.stringify(adaptationFormLayout),
      ],
    ])

  // Use the form layout configuration to draw the user-facing submissions page
  ;[
    { name: 'General details', sections: projectFormLayout },
    { name: 'Mitigation details', sections: mitigationFormLayout },
    { name: 'Adaptation details', sections: adaptationFormLayout },
  ].reduce((formOffset, { name, sections }) => {
    const colCount = sections.reduce(
      (count, section) =>
        count +
        Object.values(section)
          .flat()
          .filter(field => field.indexOf('__') !== 0).length,
      0
    )

    if (colCount < 1) return formOffset

    workbook
      .sheet(submissionsSheet)
      .range(`${col2Letter(formOffset)}2:${col2Letter(formOffset + colCount)}2`)
      .merged(true)
      .value(name)

    sections.reduce((sectionOffset, section) => {
      const [name, fieldset_] = Object.entries(section)[0]
      const fieldset = fieldset_.filter(
        field => field.indexOf('__') !== 0 && field !== 'fileUploads'
      )
      const colCount = fieldset.length

      if (colCount < 1) {
        return sectionOffset
      }

      workbook
        .sheet(submissionsSheet)
        .range(`${col2Letter(sectionOffset)}3:${col2Letter(sectionOffset + colCount)}3`)
        .merged(true)
        .value(name)

      workbook
        .sheet(submissionsSheet)
        .range(`${col2Letter(sectionOffset)}4:${col2Letter(sectionOffset + colCount)}4`)
        .value([fieldset])

      return sectionOffset + colCount + 1
    }, formOffset)

    return formOffset + colCount + 1
  }, 0)

  // Hide sheets
  veryHiddenSheets.forEach(sheetName => {
    // workbook.sheet(sheetName).hidden('very')
  })

  // Send the file back to the client as a download
  ctx.body = await workbook.outputAsync()
  ctx.attachment(`ccrd-template-${new Date().toISOString()}.xlsm`)
}
