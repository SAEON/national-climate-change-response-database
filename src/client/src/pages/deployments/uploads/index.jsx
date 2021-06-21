import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import { DataGrid } from '@material-ui/data-grid'
import useTheme from '@material-ui/core/styles/useTheme'

export default ({ templates }) => {
  const theme = useTheme()

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
            ]}
            rows={templates.map(({ id, createdBy: { emailAddress }, createdAt, filePath }) => ({
              id,
              createdBy: emailAddress,
              createdAt,
              filePath: filePath.split('/').pop(),
            }))}
          />
        </div>
      </CardContent>
    </Card>
  )
}
