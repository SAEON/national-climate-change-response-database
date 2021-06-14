import { useContext } from 'react'
import { context as authContext } from '../../../contexts/authorization'
import { context as userRolesContext } from '../context'
import Table from './_table'

export default ({ permission }) => {
  const { users } = useContext(userRolesContext)
  const { hasPermission } = useContext(authContext)

  if (!hasPermission(permission)) {
    return null
  }

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <Table users={users} />
    </div>
  )
}
