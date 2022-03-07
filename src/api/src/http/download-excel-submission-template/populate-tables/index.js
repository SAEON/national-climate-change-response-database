import col2Letter from '../../../lib/xlsx/col-to-letter.js'
import { FORM_HEADER_COLOR, SECTION_HEADER_COLOR, ENTRY_COLOR, WHITE } from '../_populate-forms.js'
import makeTable from './_make-table.js'

export default ({ workbook, name }) => {
  // FIRST ROW
  const sheet = workbook.sheet(name)
  sheet.row(1).height(90)
  sheet.range(`A1:A1`).value(name.toUpperCase())
  sheet.range(`A1:${col2Letter(100)}1`).style({
    fontSize: 28,
    fontColor: WHITE,
    verticalAlignment: 'center',
    fill: {
      type: 'solid',
      color: {
        rgb: FORM_HEADER_COLOR,
      },
    },
  })

  // Achievement reporting (mitigation)
  makeTable({
    sheet,
    SECTION_HEADER_COLOR,
    ENTRY_COLOR,
    WHITE,
    startCol: 0,
    cols: 3,
    title: 'Achievement reporting (mitigation)',
    subtitle:
      'e.g a Number of Kilowatt-hours of electricity generated, Kilowatt-hours of electricity saved, Kilograms of waste saved',
    defaultRowValue: ['', ''],
    headings: ['Year', 'How much was generated/saved/avoided achieved', 'Unit of achievements'],
  })

  // Project expenditure (mitigation)
  makeTable({
    sheet,
    SECTION_HEADER_COLOR,
    ENTRY_COLOR,
    WHITE,
    startCol: 4,
    cols: 2,
    title: 'Project expenditure (mitigation)',
    subtitle: `The term "project expenditure" refers to the annual cost of the previous calendar year. This is not the project's total budget; however, it is a breakdown of the annual financial expenditures.`,
    defaultRowValue: [''],
    headings: ['Year', 'Expenditure (ZAR)'],
  })

  // Project expenditure (adaptation)
  makeTable({
    sheet,
    SECTION_HEADER_COLOR,
    ENTRY_COLOR,
    WHITE,
    startCol: 7,
    cols: 2,
    title: 'Project expenditure (adaptation)',
    subtitle: `The term "project expenditure" refers to the annual cost of the previous calendar year. This is not the project's total budget; however, it is a breakdown of the annual financial expenditures.`,
    defaultRowValue: [''],
    headings: ['Year', 'Expenditure (ZAR)'],
  })
}
