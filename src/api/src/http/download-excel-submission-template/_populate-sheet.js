import col2Letter from '../../lib/xlsx/col-to-letter.js'

const FORM_WIDTH = 12
const FORM_HEADER_COLOR = '375623'
const SECTION_HEADER_COLOR = '548235'
const ENTRY_COLOR = 'E2EFDA'
const WHITE = 'FFFFFF'

export default ({
  workbook,
  name,
  title,
  formLayout,
  inputFields,
  blacklistFields,
  defaultContent = {},
}) => {
  // FIRST ROW
  const sheet = workbook.sheet(name)
  sheet.row(1).height(90)
  sheet.range(`A1:A1`).value(title)
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

  formLayout.reduce((y, section) => {
    const [title, fields_] = Object.entries(section)[0]
    const fields = fields_.filter(f => !blacklistFields.includes(f))

    if (fields.length) {
      // Write the title
      sheet.range(`A${y}:A${y}`).value(title.toUpperCase())
      sheet.range(`A${y}:${col2Letter(150)}${y}`).style({
        fontSize: 18,
        fontColor: WHITE,
        verticalAlignment: 'center',
        fill: {
          type: 'solid',
          color: {
            rgb: SECTION_HEADER_COLOR,
          },
        },
      })
      sheet.row(y).height(60)

      // Increment Y
      y++

      fields.forEach(field => {
        const [label, description] = inputFields[field].description.split('::').map(f => f.trim())

        // Add title
        sheet.range(`A${y}:A${y}`).value(label).style({
          bold: true,
          verticalAlignment: 'center',
          horizontalAlignment: 'center',
          wrapText: true,
        })
        sheet.row(y).height(60)

        // Format the entry area
        sheet
          .range(`B${y}:${col2Letter(FORM_WIDTH - 1)}${y}`)
          .merged(true)
          .value(defaultContent[field] || '')
          .style({
            bold: false,
            verticalAlignment: 'center',
            fill: {
              type: 'solid',
              color: {
                rgb: ENTRY_COLOR,
              },
            },
          })

        // Skip a line and add the description
        y++
        sheet
          .range(`B${y}:${col2Letter(FORM_WIDTH - 1)}${y}`)
          .merged(true)
          .value(
            `(Description) ${description
              .replaceAll('<b>', '')
              .replaceAll('</b>', '')
              .replaceAll('<br/>', '')
              .replaceAll('<br />', '')}`
          )
          .style({
            italic: true,
            bold: false,
            fontSize: 8,
            wrapText: true,
            verticalAlignment: 'top',
          })
        sheet.row(y).height(60)

        // Skip a line after the description
        y++
      })
    }

    return y
  }, 2)
}
