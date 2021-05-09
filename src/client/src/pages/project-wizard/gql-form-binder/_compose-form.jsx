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
    const set1 = new Set(
      Object.entries(sections)
        .map(([, fields]) => fields)
        .flat()
    )
    const set2 = new Set(fields.map(({ name }) => name))
    const set3 = new Set([...set1, ...set2])
    if (!(set3.size == set1.size && set3.size == set2.size)) {
      throw new Error(
        'Oops! The graphQL input type does not match the client form logic. You need to explicitly assign each input field into a group (or you have assigned the same form into two groups)'
      )
    }
  }

  return (
    <>
      {Object.entries(sections).map(([title, sectionFields], i) => (
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
