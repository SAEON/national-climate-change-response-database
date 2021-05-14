import useTheme from '@material-ui/core/styles/useTheme'
import FormSection from './_form-section'
import { NCCRD_DEPLOYMENT_ENV } from '../../../config'
import sift from 'sift'

export default ({
  fields,
  RenderField,
  sections,
  formNumber = 0,
  cardStyle = {},
  cardContentStyle = {},
  cardHeaderStyle = {},
}) => {
  const theme = useTheme()

  /**
   * Check that the form is configured properly
   * (But not in production - strictly for development!)
   */
  if (NCCRD_DEPLOYMENT_ENV !== 'production') {
    const _fields = Object.entries(sections)
      .map(([, fields]) => fields)
      .flat()

    const set1 = new Set(_fields)
    const set2 = new Set(fields.map(({ name }) => name))
    const set3 = new Set([...set1, ...set2])

    if (set1.size !== _fields.length) {
      throw new Error('Duplicate fields have been defined for multiple form sections')
    }

    if (!(set3.size === set1.size && set3.size === set2.size)) {
      throw new Error(
        `Oops! The graphQL input type does not match the client form logic. You need to explicitly assign each input field into a group. Sorry this is a manual process! (But it is as easy as updating an array of field values in the form builder)

Fields:
${JSON.stringify(_fields, null, 2)}

Sections:
${JSON.stringify(sections, null, 2)}`
      )
    }
  }

  return (
    <>
      {Object.entries(sections).map(([title, sectionFields], i) => {
        const _sectionFields = fields.filter(
          sift({
            name: {
              $in: sectionFields,
            },
          })
        )

        return (
          <FormSection
            formNumber={formNumber}
            key={title}
            cardStyle={Object.assign(
              { marginTop: i === 0 ? 'inherit' : theme.spacing(2) },
              cardStyle
            )}
            cardContentStyle={cardContentStyle}
            cardHeaderStyle={cardHeaderStyle}
            title={title}
            fields={sectionFields.map(_name => _sectionFields.find(({ name }) => _name === name))}
            RenderField={RenderField}
          />
        )
      })}
    </>
  )
}
