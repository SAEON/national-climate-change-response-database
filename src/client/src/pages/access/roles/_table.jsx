import DataGrid from 'react-data-grid'

const headerRenderer = ({ column }) => (
  <div style={{ width: '100%', textAlign: 'center' }}>{column.name}</div>
)

export default ({ permissions }) => {
  return (
    <DataGrid
      enableVirtualization={true}
      columns={[
        { key: 'name', name: 'Name', width: 200, resizable: true, headerRenderer },
        {
          key: 'description',
          name: 'Description',
          resizable: true,
          headerRenderer,
        },
      ]}
      rows={permissions.map(({ id, name, description }) => ({
        id,
        name,
        description,
      }))}
    />
  )
}
