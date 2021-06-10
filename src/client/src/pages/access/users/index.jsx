import { useContext } from 'react'
import { context as authContext } from '../../../contexts/authorization'
import { context as userRolesContext } from '../context'
import Table from './_table'

export default ({ access }) => {
  const { users } = useContext(userRolesContext)
  const { isAuthorized } = useContext(authContext)

  if (!isAuthorized(access)) {
    return null
  }

  return (
    <div style={{ height: 800, width: '100%', position: 'relative' }}>
      <Table users={users} />
    </div>
  )
}
