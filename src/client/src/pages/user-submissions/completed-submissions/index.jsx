import { useMemo } from 'react'
import 'react-data-grid/lib/styles.css'
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
            key: 'status',
            name: 'Status',
            headerRenderer,
            width: 140,
          },
          {
            key: 'comments',
            name: 'Comments',
            headerRenderer,
          },
          {
            key: '_view',
            name: '',
            width: 100,
            formatter: ({ row: { formNumber } }) => (
              <div style={{ width: '100%', textAlign: 'center' }}>
                <Link component={RouterLink} to={`/submissions/${formNumber}`} underline="hover">
                  View
                </Link>
              </div>
            ),
          },
          {
            key: '_edit',
            name: '',
            width: 100,
            formatter: ({ row: { formNumber } }) => (
              <div style={{ width: '100%', textAlign: 'center' }}>
                <Link
                  component={RouterLink}
                  to={`/submissions/${formNumber}/edit`}
                  underline="hover"
                >
                  Edit
                </Link>
              </div>
            ),
          },
        ]}
        rows={_submissions.map(
          ({ id, _id, project, submissionStatus, submissionComments: comments } = {}) => {
            const { title = 'Untitled', interventionType } = project || {}
            const { term: intervention = 'NA' } = interventionType || {}

            return {
              id: _id,
              formNumber: id,
              title,
              status: submissionStatus?.term,
              intervention,
              comments,
            }
          }
        )}
      />
    </div>
  )
}
