import { useContext } from 'react'
import { GqlBoundFormInput, context as formContext, EnumField } from './gql-form-binder'
import FormContainer from './_form-container'
import Button from '@material-ui/core/Button'
import PlusIcon from 'mdi-react/PlusIcon'

export default () => {
  const {
    mitigationFields,
    mitigationsForm,
    updateMitigationForm,
    addMitigationForm,
    removeMitigationForm,
  } = useContext(formContext)

  return (
    <>
      {mitigationsForm.map((form, i) => (
        <FormContainer title={form.title} key={i}></FormContainer>
      ))}
      <div style={{ display: 'flex' }}>
        <Button
          variant="contained"
          disableElevation
          color="primary"
          onClick={addMitigationForm}
          endIcon={<PlusIcon />}
          style={{ marginLeft: 'auto' }}
        >
          Add details
        </Button>
      </div>
    </>
  )
}
