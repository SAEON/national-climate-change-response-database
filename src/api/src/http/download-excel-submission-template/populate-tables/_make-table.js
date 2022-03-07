import col2Letter from '../../../lib/xlsx/col-to-letter.js'

export default ({
  sheet,
  SECTION_HEADER_COLOR,
  ENTRY_COLOR,
  WHITE,
  startCol,
  cols,
  title,
  subtitle,
  headings,
  defaultRowValue,
}) => {
  const A = col2Letter(startCol)
  const B = col2Letter(startCol + (cols - 1))

  sheet
    .range(`${A}2:${B}2`)
    .merged(true)
    .value(title)
    .style({
      verticalAlignment: 'center',
      horizontalAlignment: 'center',
      bold: true,
      fontColor: WHITE,
      fontSize: 18,
      fill: {
        type: 'solid',
        color: {
          rgb: SECTION_HEADER_COLOR,
        },
      },
    })

  // Subtitle
  sheet.range(`${A}3:${B}3`).merged(true).value(subtitle).style({
    italic: true,
    fontSize: 8,
    verticalAlignment: 'center',
    horizontalAlignment: 'center',
    wrapText: true,
  })

  // Table headers
  sheet.range(`${A}4:${B}4`).value([headings]).style({
    italic: false,
    bold: true,
    verticalAlignment: 'center',
    horizontalAlignment: 'center',
    wrapText: true,
  })

  // Table data
  const year = new Date().getFullYear()
  sheet
    .range(`${A}5:${B}45`)
    .value(new Array(40).fill(null).map((rw, i) => [year - i, ...defaultRowValue]))
  sheet.range(`${col2Letter(startCol + 1)}5:${B}44`).style({
    fill: {
      type: 'solid',
      color: {
        rgb: ENTRY_COLOR,
      },
    },
  })
}
