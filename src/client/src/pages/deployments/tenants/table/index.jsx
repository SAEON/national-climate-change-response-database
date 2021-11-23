import { useContext } from 'react'
import { context as tenantsContext } from '../_context'
import DataGrid from 'react-data-grid'
import IconButton from '@mui/material/IconButton'
import ViewIcon from 'mdi-react/EyeIcon'
import Tooltip from '@mui/material/Tooltip'

const headerRenderer = ({ column }) => (
  <div style={{ width: '100%', textAlign: 'center' }}>{column.name}</div>
)

const Table = ({ tenants }) => {
  return (
    <div style={{ height: 1000 }}>
      <DataGrid
        style={{ height: '100%' }}
        enableVirtualization={true}
        columns={[
          { key: 'hostname', name: 'Hostname', headerRenderer },
          { key: 'title', name: 'Title', headerRenderer },
          { key: 'shortTitle', name: 'Title (short)', headerRenderer },
          { key: 'frontMatter', name: 'Home page content', headerRenderer },
          { key: 'description', name: 'Description', headerRenderer },
          {
            key: '_view',
            name: '',
            headerRenderer,
            width: 100,
            formatter: ({ row: { hostname } }) => (
              <div style={{ width: '100%', textAlign: 'center' }}>
                <Tooltip title="View deployment">
                  <IconButton
                    size="small"
                    href={`http://${hostname}${
                      hostname.toLowerCase().includes('localhost') ? ':3001' : ''
                    }`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ViewIcon size={18} />
                  </IconButton>
                </Tooltip>
              </div>
            ),
          },
        ]}
        rows={[...tenants]
          .sort(({ hostname: a }, { hostname: b }) => {
            if (a > b) return 1
            if (a < b) return -1
            return 0
          })
          .map(t => ({ ...t }))}
      />
    </div>
  )
}

export default () => {
  const { tenants } = useContext(tenantsContext)
  return <Table tenants={tenants} />
}
