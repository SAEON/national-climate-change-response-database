import { useContext, memo } from 'react'
import { context as formContext } from '../../gql-form-binder'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import PlusIcon from 'mdi-react/PlusIcon'
import Collapse from '../../../../components/collapse'
import useTheme from '@material-ui/core/styles/useTheme'
import FormIcon from 'mdi-react/PencilIcon'
import DeleteIcon from 'mdi-react/DeleteIcon'
import RenderField from './_render-field'
import { ComposeForm } from '../../gql-form-binder'

const Compose = memo(({ fields }) => {
  const theme = useTheme()
  const { adaptationForms, addAdaptationForm, removeAdaptationForm } = useContext(formContext)

  return (
    <>
      {adaptationForms.map((form, i) => {
        return (
          <div key={i} style={{ marginBottom: theme.spacing(2) }}>
            <Collapse
              avatarStyle={{ backgroundColor: theme.palette.primary.light }}
              Icon={FormIcon}
              title={form.title || 'No title'}
              actions={[
                <IconButton
                  onClick={e => {
                    e.stopPropagation()
                    removeAdaptationForm(i)
                  }}
                  key="delete"
                >
                  <DeleteIcon />
                </IconButton>,
              ]}
            >
              <div style={{ padding: theme.spacing(2) }}>
                <ComposeForm
                  RenderField={RenderField}
                  fields={fields}
                  formNumber={i}
                  cardStyle={{ backgroundColor: 'transparent', border: 'none' }}
                  cardContentStyle={{ paddingLeft: 0, paddingRight: 0 }}
                  cardHeaderStyle={{ paddingLeft: 0, paddingRight: 0 }}
                  sections={{
                    'Adaptation details': [
                      'title',
                      'description',
                      'adaptationPurpose',
                      'adaptationSector',
                      'startDate',
                      'endDate',
                    ],
                    'Hazard details': ['hazardFamily', 'hazardSubFamily', 'hazard', 'subHazard'],
                    'Location(s)': ['yx'],
                    'Associated research': [
                      'isResearch',
                      'researchDescription',
                      'researchType',
                      'researchTargetAudience',
                      'researchAuthor',
                      'researchPaper',
                    ],
                  }}
                />
              </div>
            </Collapse>
          </div>
        )
      })}
      <div style={{ display: 'flex' }}>
        <Button
          disableElevation
          variant="contained"
          onClick={addAdaptationForm}
          endIcon={<PlusIcon />}
          size="large"
          color="default"
          style={{ marginRight: 'auto' }}
        >
          Add adaptation component
        </Button>
      </div>
    </>
  )
})

/**
 * Don't render ComposeForm directly,
 * as that will trigger many re-renders
 */
export default () => {
  const { adaptationFields } = useContext(formContext)
  return <Compose fields={adaptationFields} />
}
