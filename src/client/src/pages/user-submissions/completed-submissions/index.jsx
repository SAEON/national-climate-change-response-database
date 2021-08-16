import { useMemo } from 'react'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { DataGrid } from '@material-ui/data-grid'
import useTheme from '@material-ui/core/styles/useTheme'
import Link from '@material-ui/core/Link'
import { Link as RouterLink } from 'react-router-dom'

export default ({ submissions }) => {
  const theme = useTheme()
  const _submissions = useMemo(
    () => [...submissions].filter(({ isSubmitted }) => isSubmitted),
    [submissions]
  )

  return (
    <Card
      style={{ border: 'none', width: '100%', backgroundColor: theme.backgroundColor }}
      variant="outlined"
    >
      <CardContent style={{ padding: 0 }}>
        <div style={{ height: 1000 }}>
          <DataGrid
            pageSize={25}
            rowHeight={theme.spacing(5)}
            columns={[
              {
                field: 'title',
                headerName: 'Title',
                width: 120,
              },
              {
                field: 'intervention',
                headerName: 'Intervention',
                width: 160,
              },
              {
                field: 'isSubmitted',
                headerName: 'Submitted',
                sortable: false,
                filterable: false,
                disableColumnMenu: true,
                width: 120,
              },
              {
                field: 'status',
                headerName: 'Status',
                width: 140,
              },
              {
                field: 'comments',
                headerName: 'Comments',
                width: 180,
              },
              {
                field: '_edit',
                headerName: ` `,
                sortable: false,
                filterable: false,
                disableColumnMenu: true,
                flex: 1,
                renderCell: ({ row: { formNumber } }) => (
                  <Link component={RouterLink} to={`/submissions/${formNumber}/edit`}>
                    Edit submission
                  </Link>
                ),
              },
            ]}
            rows={_submissions.map(
              ({
                id,
                _id,
                project: { title = '', interventionType: { term: intervention = '' } = {} } = {},
                isSubmitted,
                submissionStatus: { term: status },
                submissionComments: comments,
              }) => ({
                id: _id,
                formNumber: id,
                title,
                status,
                intervention,
                comments,
                isSubmitted: isSubmitted ? 'Yes' : 'No',
              })
            )}
          />
        </div>
      </CardContent>
    </Card>
  )
}
