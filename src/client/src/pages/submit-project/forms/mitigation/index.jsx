import { useContext } from 'react'
import { context as formContext, ComposeForm } from '../../gql-form-binder'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import PlusIcon from 'mdi-react/PlusIcon'
import Collapse from '../../../../components/collapse'
import useTheme from '@material-ui/core/styles/useTheme'
import FormIcon from 'mdi-react/PencilIcon'
import DeleteIcon from 'mdi-react/DeleteIcon'
import RenderField from './_render-field'

const Compose = ({ fields }) => {
  const theme = useTheme()
  const { mitigationForms, addMitigationForm, removeMitigationForm } = useContext(formContext)

  return (
    <>
      {mitigationForms.map((form, i) => {
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
                    removeMitigationForm(i)
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
                    'Mitigation information': [
                      'title',
                      'description',
                      'mitigationType',
                      'mitigationSubType',
                      'interventionStatus',
                    ],
                    'Carbon credit program': [
                      'carbonCredit',
                      'volMethodology',
                      'goldStandard',
                      'vcs',
                      'otherCarbonCreditStandard',
                      'otherCarbonCreditStandardDescription',
                    ],
                    'CDM information': [
                      'cdmProjectNumber',
                      'cdmMethodology',
                      'cdmExecutiveStatus',
                      'cdmStatus',
                    ],
                    'IPCC information': [
                      'hostSector',
                      'hostSubSectorPrimary',
                      'hostSubSectorSecondary',
                    ],
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
          onClick={addMitigationForm}
          endIcon={<PlusIcon />}
          size="large"
          color="default"
          style={{ marginRight: 'auto' }}
        >
          Add mitigation component
        </Button>
      </div>
    </>
  )
}

export default () => {
  const { mitigationFields } = useContext(formContext)

  return <Compose fields={mitigationFields} />
}
