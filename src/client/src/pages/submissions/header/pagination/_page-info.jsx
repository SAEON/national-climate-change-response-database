import { useContext } from 'react'
import { context as resultContext } from '../../context'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

export default () => {
  const { currentPage, pageSize, totalRecords } = useContext(resultContext)
  const theme = useTheme()

  const max = Math.min(currentPage * pageSize + pageSize, totalRecords)
  const min = Math.min(currentPage * pageSize + 1, max)

  return (
    <Typography
      style={{ marginLeft: theme.spacing(1), marginRight: theme.spacing(1) }}
      variant="overline"
    >
      {min} - {max} of {totalRecords} submissions
    </Typography>
  )
}
