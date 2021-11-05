import { useTheme } from '@mui/material/styles'
import FormSection from './_form-section'
import { NCCRD_DEPLOYMENT_ENV } from '../../../config'
import sift from 'sift'

/**
 * Note the "sections" property and how it works with the "fields" property!
 *
 * <ComposeForm
 *  sections={{
 *   "Title": [list of field names]
 *  }}
 *  fields={gql fields}
 * />
 *
 * By default fields defined in the sections need to match the fields
 * returned by the GraphQL query for the input types. BUT this can be
 * limiting if you want to have a form section with fields that are NOT
 * in the input type.
 *
 * To achieve this, any field names that start with "__" are passed back to
 * the render component
 */
export default ({ formName, fields, RenderField, sections, formNumber = 0, hideSections = [] }) => {
  const theme = useTheme()

  /**
   * Check that the form is configured properly
   * (But not in production - strictly for development!)
   */
  if (NCCRD_DEPLOYMENT_ENV !== 'production') {
    const _fields = Object.entries(sections)
      .map(([, fields]) => fields)
      .flat()
      .filter(field => !field.match(/^__/))

    const set1 = new Set(_fields)
    const set2 = new Set(fields.map(({ name }) => name))
    const set3 = new Set([...set1, ...set2])

    if (set1.size !== _fields.length) {
      throw new Error('Duplicate fields have been defined for multiple form sections')
    }

    if (!(set3.size === set1.size && set3.size === set2.size)) {
      throw new Error(
        `Oops! The graphQL input type does not match the client form logic. You need to explicitly assign each input field into a section. Either a field in the GraphQL type has NOT been added to a section, or there is a field defined in a section that does NOT exist on the GraphQL type. Sorry this is a manual process! (But it is as easy as updating an array of field values in the form builder)

Fields defined on the GraphQL type:
${JSON.stringify(
  fields.map(({ name }) => name),
  null,
  2
)}

Fields defined in the form sections:
${JSON.stringify(sections, null, 2)}`
      )
    }
  }

  return <>
    {Object.entries(sections).map(([title, sectionFields], i) => {
      const _sectionFields = fields.filter(
        sift({
          name: {
            $in: sectionFields,
          },
        })
      )

      if (hideSections.includes(title)) {
        return null
      }

      return (
        <FormSection
          formName={formName}
          formNumber={formNumber}
          key={title}
          cardStyle={{ marginTop: i === 0 ? 'inherit' : theme.spacing(2) }}
          title={title}
          fields={sectionFields.map(_name => {
            if (_name.match(/^__/)) {
              return { name: _name, type: { name: 'dynamic' } }
            }
            return _sectionFields.find(({ name }) => _name === name)
          })}
          RenderField={RenderField}
        />
      );
    })}
  </>;
}
