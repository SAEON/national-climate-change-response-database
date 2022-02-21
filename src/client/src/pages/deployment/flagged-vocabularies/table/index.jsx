import { useContext } from 'react'
import { context as dataContext } from '../_context'
import DataGrid from 'react-data-grid'
import { Div } from '../../../../components/html-tags'
import Link from '@mui/material/Link'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import ViewIcon_ from 'mdi-react/EyeIcon'
import Tooltip from '@mui/material/Tooltip'
import AutoFixDialog from './auto-fix-dialog'

const ViewIcon = styled(ViewIcon_)({})

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
          { key: 'id', name: 'ID', headerRenderer, resizable: true },
          {
            key: 'title',
            name: 'Title',
            headerRenderer,
            resizable: true,
          },
          { key: 'field', name: 'Field', headerRenderer, resizable: true },
          { key: 'incorrectTerm', name: 'Incorrect term', headerRenderer, resizable: true },
          {
            key: 'tree',
            name: 'Tree',
            headerRenderer,
            resizable: true,
          },
          {
            key: '_fix',
            name: '',
            width: 100,
            resizable: false,
            headerRenderer,
            editorOptions: {
              renderFormatter: true,
            },
            formatter: ({ row }) => (
              <>
                <AutoFixDialog {...row} />
              </>
            ),
          },

          {
            key: 'url',
            name: '',
            headerRenderer,
            resizable: false,
            width: 100,
            formatter: ({ row: { url } }) => {
              return (
                <Div sx={{ width: '100%', textAlign: 'center' }}>
                  <Tooltip placement="left-start" title="View Submission">
                    <IconButton
                      target="_blank"
                      rel="noopener noreferrer"
                      href={url}
                      component={Link}
                      size="small"
                    >
                      <ViewIcon size={18} />
                    </IconButton>
                  </Tooltip>
                </Div>
              )
            },
          },
        ]}
        rows={json.map(({ ID: id, Title: title, URL: url, Tree: tree, Field: field, ...o }) => ({
          id,
          title,
          field,
          tree,
          incorrectTerm: o['Incorrect term'],
          url,
        }))}
      />
    </Div>
  )
}
