import useTheme from '@material-ui/core/styles/useTheme'
import FormSection from './_form-section'
import { NCCRD_DEPLOYMENT_ENV } from '../../../config'
import sift from 'sift'

export default ({ fields, RenderField, sections }) => {
  const theme = useTheme()

  /**
   * Check that the form is configured properly
   * But not in production
   */
  if (NCCRD_DEPLOYMENT_ENV !== 'production') {
    const _sections = new Set(
      Object.entries(sections)
        .map(([, fields]) => fields)
        .flat()
    )
    const _fields = new Set(fields.map(({ name }) => name))
    const _check = new Set([..._sections, ..._fields])
    if (!(_check.size == _sections.size && _check.size == _fields.size)) {
      throw new Error(
        'Oops! The graphQL input type does not match the client form logic. You need to explicitly assign each input field into a group (or you have assigned the same form into two groups)'
      )
    }
  }

  return (
    <>
      {Object.entries(sections).map(([title, sectionFields], i) => (
        <FormSection
          key={title}
          style={i === 0 ? {} : { marginTop: theme.spacing(2) }}
          title={title}
          fields={fields.filter(
            sift({
              name: {
                $in: sectionFields,
              },
            })
          )}
          RenderField={RenderField}
        />
      ))}
    </>
  )
}
