import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import { DataGrid } from '@material-ui/data-grid'
import IconButton from '@material-ui/core/IconButton'
import DownloadIcon from 'mdi-react/DownloadIcon'
import Link from '@material-ui/core/Link'
import useTheme from '@material-ui/core/styles/useTheme'
import useStyles from './style'
import clsx from 'clsx'
import { NCCRD_API_HTTP_ADDRESS } from '../../../config'
import Tooltip from '@material-ui/core/Tooltip'

export default ({ templates }) => {
  const theme = useTheme()
  const classes = useStyles()

  return (
    <Card>
      <CardHeader title="Uploaded templates" />
      <CardContent>
        <div style={{ height: 500 }}>
          <DataGrid
            pageSize={25}
            rowHeight={theme.spacing(5)}
            columns={[
              {
                field: 'id',
                sortable: false,
                filterable: false,
                disableColumnMenu: true,
                headerName: 'ID',
                width: 50,
              },
              { field: 'createdBy', headerName: 'Uploaded by', flex: 0.5 },
              {
                field: 'createdAt',
                headerName: 'Created at',
                flex: 0.6,
                filterable: false,
                disableColumnMenu: true,
              },
              {
                field: 'filePath',
                headerName: 'File name',
                flex: 1,
                filterable: false,
                disableColumnMenu: true,
              },
              {
                field: '_download',
                sortable: false,
                filterable: false,
                disableColumnMenu: true,
                cellClassName: () => clsx(classes.cell),
                headerName: ` `,
                width: 100,
                renderCell: ({ row: { id } }) => {
                  return (
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
                  )
                },
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
      </CardContent>
    </Card>
  )
}
