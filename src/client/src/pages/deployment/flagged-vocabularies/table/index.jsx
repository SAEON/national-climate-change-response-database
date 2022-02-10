import { useContext } from 'react'
import { context as dataContext } from '../_context'
import DataGrid from 'react-data-grid'
import { Div } from '../../../../components/html-tags'
import Link from '@mui/material/Link'

const headerRenderer = ({ column }) => (
  <Div sx={{ width: '100%', textAlign: 'center' }}>{column.name}</Div>
)

export default () => {
  const { json } = useContext(dataContext)
  return (
    <Div sx={{ height: 1000 }}>
      <DataGrid
        style={{ height: '100%' }}
        enableVirtualization={true}
        columns={[
          { key: 'ID', name: 'ID', headerRenderer, size: 100 },
          {
            key: 'Title',
            name: 'Title',
            headerRenderer,
            size: 100,
          },
          { key: 'Field', name: 'Field', headerRenderer, size: 100 },
          { key: 'Incorrect term', name: 'Incorrect term', headerRenderer, size: 100 },
          {
            key: 'URL',
            name: 'URL',
            headerRenderer,
            formatter: ({ row: { URL } }) => {
              return (
                <Div sx={{ width: '100%', textAlign: 'center' }}>
                  <Link target="_blank" rel="noopener noreferrer" href={URL}>
                    View submission
                  </Link>
                </Div>
              )
            },
          },
        ]}
        rows={json.map(({ ID, Title, URL, Field, ...o }) => ({
          ID,
          Title,
          Field,
          'Incorrect term': o['Incorrect term'],
          URL,
        }))}
      />
    </Div>
  )
}
