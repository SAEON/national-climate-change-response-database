import { useContext } from 'react'
import Form, { context as formContext } from './form'

export default () => {
  const { projectFields, projectForm, updateProjectForm } = useContext(formContext)
  return (
    <Form
      title="Project details"
      multilineFields={['description', 'projectManager']}
      fields={projectFields}
      form={projectForm}
      updateForm={updateProjectForm}
    />
  )
}
