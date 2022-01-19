import { useContext } from 'react'
import { context as resultContext } from '../../context'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

export default () => {
  const { currentPage, pageSize, totalRecords } = useContext(resultContext)
  const theme = useTheme()
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'))

  const max = Math.min(currentPage * pageSize + pageSize, totalRecords)
  const min = Math.min(currentPage * pageSize + 1, max)

  return (
    <Typography
      sx={theme => ({ marginLeft: theme.spacing(1), marginRight: theme.spacing(1) })}
      variant="overline"
    >
      {min} - {max} of {totalRecords} {lgUp ? 'submissions' : ''}
    </Typography>
  )
}
