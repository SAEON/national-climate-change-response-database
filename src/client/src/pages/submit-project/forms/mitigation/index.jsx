import { useContext, memo } from 'react'
import { context as formContext, ComposeForm } from '../../gql-form-binder'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import PlusIcon from 'mdi-react/PlusCircleIcon'
import Collapse from '../../../../components/collapse'
import useTheme from '@material-ui/core/styles/useTheme'
import FormIcon from 'mdi-react/PencilIcon'
import DeleteIcon from 'mdi-react/DeleteIcon'
import RenderField from './_render-field'

const Compose = memo(
  ({ form, i, removeForm, fields }) => {
    const theme = useTheme()

    return (
      <div style={{ marginBottom: theme.spacing(2) }}>
        <Collapse
          avatarStyle={{ backgroundColor: theme.palette.primary.light }}
          Icon={FormIcon}
          title={form.title || 'No title'}
          actions={[
            <IconButton
              onClick={e => {
                e.stopPropagation()
                removeForm(i)
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
                'Location(s)': ['yx'],
                'Associated research': [
                  'isResearch',
                  'researchDescription',
                  'researchType',
                  'researchTargetAudience',
                  'researchAuthor',
                  'researchPaper',
                ],
                'Energy/emissions data': ['energyOrEmissionsData', 'energyData', 'emissionsData'],
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
              }}
            />
          </div>
        </Collapse>
      </div>
    )
  },
  ({ i: iA, form: { ...fieldsA } }, { i: iB, form: { ...fieldsB } }) => {
    let _memo = true
    if (iA !== iB) _memo = false
    if (fieldsA.title !== fieldsB.title) _memo = false
    return _memo
  }
)

const Form = ({ i, fields, removeForm }) => {
  const { mitigationForms: forms } = useContext(formContext)
  return <Compose i={i} form={forms[i]} fields={fields} removeForm={removeForm} />
}

/**
 * This component should only render if the
 * number of forms changes
 */
const RenderForms = memo(
  ({ fields, forms, addForm, removeForm }) => (
    <>
      {forms.map((form, i) => (
        <Form key={i} i={i} fields={fields} removeForm={removeForm} />
      ))}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          onClick={addForm}
          startIcon={<PlusIcon />}
          size="large"
          color="inherit"
        >
          Add details
        </Button>
      </div>
    </>
  ),
  ({ forms: a }, { forms: b }) => {
    let _memo = true
    if (a.length !== b.length) _memo = false
    return _memo
  }
)

export default () => {
  const { mitigationFields, mitigationForms, addMitigationForm, removeMitigationForm } =
    useContext(formContext)

  return (
    <RenderForms
      fields={mitigationFields}
      forms={mitigationForms}
      addForm={addMitigationForm}
      removeForm={removeMitigationForm}
    />
  )
}
