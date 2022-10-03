import { useContext } from 'react'
import { context as tenantsContext } from '../_context'
import 'react-data-grid/lib/styles.css';
import DataGrid, { SelectColumn } from 'react-data-grid'
import IconButton from '@mui/material/IconButton'
import JsonIcon from 'mdi-react/CodeJsonIcon'
import JsonEditor from './json-editor'
import ViewIcon from 'mdi-react/EyeIcon'
import Tooltip from '@mui/material/Tooltip'

const headerRenderer = ({ column }) => (
  <div style={{ width: '100%', textAlign: 'center' }}>{column.name}</div>
)

const Table = ({ rows, setRows, selectedRows, setSelectedRows }) => {
  return (
    <div style={{ height: 1000 }}>
      <DataGrid
        style={{ height: '100%' }}
        enableVirtualization={true}
        onSelectedRowsChange={setSelectedRows}
        selectedRows={selectedRows}
        rowKeyGetter={row => row.id}
        onRowsChange={setRows}
        columns={[
          SelectColumn,
          { key: 'hostname', name: 'Hostname', resizable: true, headerRenderer },
          { key: 'title', name: 'Title', resizable: true, headerRenderer },
          { key: 'shortTitle', name: 'Title (short)', resizable: true, headerRenderer },
          {
            key: 'theme',
            name: 'Theme',
            width: 100,
            editor: props => <JsonEditor {...props} />,
            editorOptions: {
              renderFormatter: true,
            },
            resizable: true,
            formatter: () => {
              return (
                <div
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <JsonIcon size={18} />
                </div>
              )
            },
            headerRenderer,
          },
          {
            key: 'frontMatter',
            name: 'Page content',
            width: 100,
            editor: props => <JsonEditor {...props} />,
            editorOptions: {
              renderFormatter: true,
            },
            resizable: true,
            formatter: () => {
              return (
                <div
                  style={{
                    width: '100%',
                    alignItems: 'center',
                    height: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <JsonIcon size={18} />
                </div>
              )
            },
            headerRenderer,
          },
          { key: 'description', name: 'Description', resizable: true, headerRenderer },
          {
            key: '_view',
            name: '',
            headerRenderer,
            resizable: true,
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
        rows={rows}
      />
    </div>
  )
}

export default () => {
  const { rows, setRows, selectedRows, setSelectedRows } = useContext(tenantsContext)
  return (
    <Table
      rows={rows}
      setRows={setRows}
      selectedRows={selectedRows}
      setSelectedRows={setSelectedRows}
    />
  )
}
