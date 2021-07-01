import { useContext } from 'react'
import { context as formContext } from './../_context'
import Dialog from './dialog'

export default props => {
  const { submissionId } = useContext(formContext)

  return <Dialog submissionId={submissionId} {...props} />
}
