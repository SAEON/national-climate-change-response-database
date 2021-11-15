import { useContext } from 'react'
import { context as templatesContext } from './_context'
import DataGrid from 'react-data-grid'
import IconButton from '@mui/material/IconButton'
import DownloadIcon from 'mdi-react/DownloadIcon'
import Link from '@mui/material/Link'
import { NCCRD_API_HTTP_ADDRESS } from '../../../config'
import Tooltip from '@mui/material/Tooltip'

const headerRenderer = ({ column }) => (
  <div style={{ width: '100%', textAlign: 'center' }}>{column.name}</div>
)

export default () => {
  const { submissionTemplates: templates } = useContext(templatesContext)

  return (
    <div style={{ height: 1000 }}>
      <DataGrid
        style={{ height: '100%' }}
        enableVirtualization={true}
        columns={[
          { key: 'createdBy', name: 'Uploaded by', headerRenderer, size: 100 },
          {
            key: 'createdAt',
            name: 'Created at',
            headerRenderer,
            formatter: ({ row: { createdAt } }) => '' + createdAt,
            size: 100,
          },
          {
            key: 'filePath',
            name: 'File name',
            headerRenderer,
            size: 100,
          },
          {
            key: '_download',
            name: '',
            width: 100,
            headerRenderer,
            formatter: ({ row: { id } }) => (
              <div style={{ width: '100%', textAlign: 'center' }}>
                <Tooltip title="Download template">
                  <IconButton
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${NCCRD_API_HTTP_ADDRESS}/download-template?id=${id}`}
                    component={Link}
                    size="small"
                  >
                    <DownloadIcon size={18} />
                  </IconButton>
                </Tooltip>
              </div>
            ),
          },
        ]}
        rows={[...templates]
          .sort(({ createdAt: a }, { createdAt: b }) => {
            a = new Date(a)
            b = new Date(b)
            return a > b ? -1 : a < b ? 1 : 0
          })
          .map(({ id, createdBy, createdAt, filePath }) => ({
            id,
            createdBy: createdBy?.emailAddress || 'UNKNOWN',
            createdAt,
            filePath: filePath.split('/').pop(),
          }))}
      />
    </div>
  )
}
