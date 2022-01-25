import { useContext } from 'react'
import { context as dataContext } from '../../context'
import Typography from '@mui/material/Typography'

export default ({ ...props }) => {
  const { error, loading, data: _data } = useContext(dataContext)

  if (loading) {
    return (
      <Typography variant="overline" {...props}>
        Loading...
      </Typography>
    )
  }

  if (error) {
    throw error
  }

  const {
    PROJECT_COUNT: { data },
  } = _data

  const a = data.find(({ intervention }) => intervention === 'Adaptation')
  const m = data.find(({ intervention }) => intervention === 'Mitigation')
  const c = data.find(({ intervention }) => intervention === 'Cross Cutting')

  return (
    <Typography variant="overline" {...props}>
      <b>{a.total}</b> Adaptation projects. <b>{m.total}</b> Mitigation projects. <b>{c.total}</b>{' '}
      Cross cutting projects
    </Typography>
  )
}
