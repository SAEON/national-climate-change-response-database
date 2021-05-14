import { useContext, memo } from 'react'
import { context as formContext, ComposeForm } from '../../gql-form-binder'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import PlusIcon from 'mdi-react/PlusIcon'
import Collapse from '../../../../components/collapse'
import useTheme from '@material-ui/core/styles/useTheme'
import FormIcon from 'mdi-react/PencilIcon'
import DeleteIcon from 'mdi-react/DeleteIcon'
import RenderField from './_render-field'

const Compose = memo(({ fields }) => {
  const theme = useTheme()
  const { researchForms, addResearchForm, removeResearchForm } = useContext(formContext)

  return (
    <>
      {researchForms.map((form, i) => (
        <div key={i} style={{ marginBottom: theme.spacing(2) }}>
          <Collapse
            avatarStyle={{ backgroundColor: theme.palette.primary.light }}
            Icon={FormIcon}
            title={form.title || 'No title'}
            actions={[
              <IconButton
                onClick={e => {
                  e.stopPropagation()
                  removeResearchForm(i)
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
                  'Research information': [
                    'title',
                    'description',
                    'associatedProjectComponent',
                    'researchType',
                    'targetAudience',
                    'author',
                    'paper',
                  ],
                }}
              />
            </div>
          </Collapse>
        </div>
      ))}
      <div style={{ display: 'flex' }}>
        <Button
          disableElevation
          variant="contained"
          onClick={addResearchForm}
          endIcon={<PlusIcon />}
          size="large"
          color="default"
          style={{ marginRight: 'auto' }}
        >
          Add research component
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
  const { researchFields } = useContext(formContext)
  return <Compose fields={researchFields} />
}
