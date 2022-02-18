import { join, normalize, sep } from 'path'
import getCurrentDirectory from '../../lib/get-current-directory.js'
import PERMISSIONS from '../../user-model/permissions.js'
import xlsx from 'xlsx-populate'
import { pool } from '../../mssql/pool.js'
import {
  generalDetails as projectFormLayout,
  mitigationDetails as mitigationFormLayout,
  adaptationDetails as adaptationFormLayout,
} from '../../graphql/resolvers/types/form-layout/layout-config.js'
import {
  projectInputFields,
  projectVocabularyFieldsTreeMap,
  adaptationInputFields,
  adaptationVocabularyFieldsTreeMap,
  mitigationInputFields,
  mitigationVocabularyFieldsTreeMap,
} from '../../graphql/schema/index.js'

const __dirname = getCurrentDirectory(import.meta)
const baseTemplatePath = normalize(join(__dirname, `.${sep}base.xlsm`))

const vocabularySheet = '_Vocabularies'
const veryHiddenSheets = [vocabularySheet, '_VBA', '_Compile']

function colLetter(num) {
  let letters = ''
  while (num >= 0) {
    letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[num % 26] + letters
    num = Math.floor(num / 26) - 1
  }
  return letters
}

export default async ctx => {
  const { user } = ctx
  const { ensurePermission } = user
  await ensurePermission({ ctx, permission: PERMISSIONS['create-submission'] })

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

  // Write the trees to the Excel template
  Object.entries(trees).forEach(([name, tree], i) => {
    workbook
      .sheet(vocabularySheet)
      .range(`${colLetter(i)}1:${colLetter(i)}2`)
      .value([[name], [JSON.stringify(tree)]])
  })

  // Hide sheets
  veryHiddenSheets.forEach(sheetName => {
    workbook.sheet(sheetName).hidden('very')
  })

  // Send the file back to the client as a download
  ctx.body = await workbook.outputAsync()
  ctx.attachment(`ccrd-template-${new Date().toISOString()}.xlsm`)
}
