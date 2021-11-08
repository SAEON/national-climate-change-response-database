import { useState, useEffect } from 'react'
import DataGrid, { SelectColumn } from 'react-data-grid'
import RolesEditor from './_roles-editor'

const headerRenderer = ({ column }) => (
  <div style={{ width: '100%', textAlign: 'center' }}>{column.name}</div>
)

const sortUsersByEmail = users =>
  [...users].sort(({ emailAddress: a }, { emailAddress: b }) => {
    if (a > b) return 1
    if (a < b) return -1
    return 0
  })

export default ({ users, selectedUsers, setSelectedUsers, roles }) => {
  const [rows, setRows] = useState(sortUsersByEmail(users))
  useEffect(() => setRows(sortUsersByEmail(users)), [users])

  return (
    <DataGrid
      style={{ height: '100%' }}
      enableVirtualization={true}
      onSelectedRowsChange={setSelectedUsers}
      selectedRows={selectedUsers}
      rowKeyGetter={row => row.id}
      onRowsChange={setRows}
      rows={rows}
      columns={[
        SelectColumn,
        {
          key: 'emailAddress',
          name: 'Email address',
          resizable: true,
          width: 200,
          headerRenderer,
        },
        {
          key: 'name',
          name: 'Name',
          resizable: true,
          width: 250,
          headerRenderer,
        },
        {
          key: 'roles',
          name: 'Roles',
          resizable: true,
          headerRenderer,
          editorOptions: {
            renderFormatter: true,
          },
          editor: props => <RolesEditor rows={rows} setRows={setRows} roles={roles} {...props} />,
          formatter: ({ row: { roles } }) =>
            [...roles]
              .sort(({ name: a }, { name: b }) => {
                if (a > b) return 1
                if (a < b) return -1
                return 0
              })
              .map(({ name }) => name.toUpperCase())
              .join(', '),
        },
      ]}
    />
  )
}
