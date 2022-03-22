import { useMemo } from 'react'
import DataGrid from 'react-data-grid'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'

const headerRenderer = ({ column }) => (
  <div style={{ width: '100%', textAlign: 'center' }}>{column.name}</div>
)

export default ({ active, submissions }) => {
  const inProgressSubmissions = useMemo(
    () => [...submissions].filter(({ isSubmitted }) => !isSubmitted),
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
            width: 250,
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
            width: 120,
            headerRenderer,
          },
          {
            key: '_edit',
            name: '',
            formatter: ({ row: { formNumber } }) => (
              <div style={{ width: '100%', textAlign: 'center' }}>
                <Link
                  component={RouterLink}
                  to={`/submissions/new/${formNumber}`}
                  underline="hover"
                >
                  Continue submission
                </Link>
              </div>
            ),
          },
        ]}
        rows={inProgressSubmissions.map(({ id, _id, project, isSubmitted } = {}) => {
          const { title = 'Untitled', interventionType = 'NA' } = project || {}
          const { term: intervention } = interventionType || {}

          return {
            id: _id,
            formNumber: id,
            intervention: intervention || '',
            title: title || 'Unknown',
            isSubmitted: isSubmitted ? 'Yes' : 'No',
          }
        })}
      />
    </div>
  )
}
