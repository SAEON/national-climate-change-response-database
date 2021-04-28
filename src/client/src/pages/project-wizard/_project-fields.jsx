import { useContext } from 'react'
import Form, { context as formContext } from './form'

export default () => {
  const { projectFields } = useContext(formContext)
  console.log(projectFields)
  return (
    <Form
      title="Project details"
      multilineFields={['description', 'projectManager']}
      fields={projectFields}
    />
  )
}
