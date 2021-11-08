import { useMemo } from 'react'
import DataGrid from 'react-data-grid'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'

const headerRenderer = ({ column }) => (
  <div style={{ width: '100%', textAlign: 'center' }}>{column.name}</div>
)

export default ({ active, submissions }) => {
  const _submissions = useMemo(
    () => [...submissions].filter(({ isSubmitted }) => isSubmitted),
    [submissions]
  )

  if (!active) {
    return null
  }

  return (
    <div style={{ height: 1000 }}>
      <DataGrid
        style={{ height: '100%' }}
        enableVirtualization={true}
        columns={[
          {
            key: 'title',
            name: 'Title',
            width: 120,
            headerRenderer,
          },
          {
            key: 'intervention',
            name: 'Intervention',
            width: 160,
            headerRenderer,
          },
          {
            key: 'isSubmitted',
            name: 'Submitted',
            headerRenderer,
            width: 120,
          },
          {
            key: 'status',
            name: 'Status',
            headerRenderer,
            width: 140,
          },
          {
            key: 'comments',
            name: 'Comments',
            width: 180,
            headerRenderer,
          },
          {
            key: '_edit',
            name: '',
            formatter: ({ row: { formNumber } }) => (
              <div style={{ width: '100%', textAlign: 'center' }}>
                <Link
                  component={RouterLink}
                  to={`/submissions/${formNumber}/edit`}
                  underline="hover"
                >
                  Edit submission
                </Link>
              </div>
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
  )
}
