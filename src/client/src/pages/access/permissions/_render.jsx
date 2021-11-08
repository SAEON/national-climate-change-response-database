import { memo } from 'react'
import DataGrid from 'react-data-grid'

const headerRenderer = ({ column }) => (
  <div style={{ width: '100%', textAlign: 'center' }}>{column.name}</div>
)

export default memo(({ permissions }) => (
  <div style={{ height: 1000 }}>
    <DataGrid
      style={{ height: '100%' }}
      enableVirtualization={true}
      columns={[
        { key: 'name', name: 'Name', width: 200, headerRenderer, resizable: true },
        {
          key: 'description',
          name: 'Description',
          headerRenderer,
          resizable: true,
        },
      ]}
      rows={permissions.map(({ id, name, description }) => ({ id, name, description }))}
    />
  </div>
))
