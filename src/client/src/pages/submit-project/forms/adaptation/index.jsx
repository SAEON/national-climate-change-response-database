import { useContext, memo } from 'react'
import { context as formContext, ComposeForm } from '../../gql-form-binder'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import Grid from '@material-ui/core/Grid'
import PlusIcon from 'mdi-react/PlusIcon'
import Collapse from '../../../../components/collapse'
import useTheme from '@material-ui/core/styles/useTheme'
import FormIcon from 'mdi-react/PencilIcon'
import DeleteIcon from 'mdi-react/DeleteIcon'
import RenderField from './_render-field'
import makeStyles from '@material-ui/core/styles/makeStyles'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  disabledButton: {
    '& .MuiButton-contained.Mui-disabled': {
      backgroundColor: theme.palette.grey[500],
    },
  },
}))

const Compose = memo(
  ({ i, form, fields }) => {
    const theme = useTheme()

    return (
      <div key={i} style={{ marginBottom: theme.spacing(2) }}>
        <Collapse
          avatarStyle={{ backgroundColor: theme.palette.primary.light }}
          Icon={FormIcon}
          title={form.title || 'No title'}
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
                  'interventionStatus',
                  'startYear',
                  'endYear',
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
                'Hazard details': ['hazardFamily', 'hazardSubFamily', 'hazard', 'subHazard'],
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
  const { adaptationForms: forms } = useContext(formContext)
  return <Compose i={i} form={forms[i]} fields={fields} removeForm={removeForm} />
}

/**
 * This component should only render if the
 * number of forms changes
 */
const RenderForms = memo(
  ({ fields, forms, addForm, removeForm }) => {
    const classes = useStyles()

    return (
      <>
        {forms.map((_, i) => (
          <Form key={i} i={i} fields={fields} />
        ))}
        <Grid container spacing={2} justify="flex-end">
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip title="Remove last entry">
              <span className={clsx(classes.disabledButton)}>
                <Button
                  fullWidth
                  variant="contained"
                  disabled={!forms.length}
                  onClick={() => removeForm(forms.length - 1)}
                  startIcon={<DeleteIcon />}
                  size="large"
                  color="inherit"
                >
                  Remove details
                </Button>
              </span>
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Tooltip title="Add details form">
              <Button
                fullWidth
                variant="contained"
                onClick={addForm}
                startIcon={<PlusIcon />}
                size="large"
                color="inherit"
              >
                Add details
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
      </>
    )
  },
  ({ forms: a }, { forms: b }) => {
    let _memo = true
    if (a.length !== b.length) _memo = false
    return _memo
  }
)

/**
 * This component should only render if the
 * number of forms changes
 */
export default () => {
  const { adaptationFields, adaptationForms, addAdaptationForm, removeAdaptationForm } =
    useContext(formContext)

  return (
    <RenderForms
      fields={adaptationFields}
      forms={adaptationForms}
      addForm={addAdaptationForm}
      removeForm={removeAdaptationForm}
    />
  )
}
