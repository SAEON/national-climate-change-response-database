import { useContext } from 'react'
import { context as resultContext } from '../../context'
import Typography from '@material-ui/core/Typography'
import useTheme from '@material-ui/core/styles/useTheme'

export default () => {
  const { currentPage, pageSize } = useContext(resultContext)
  const theme = useTheme()

  return (
    <Typography
      style={{ marginLeft: theme.spacing(1), marginRight: theme.spacing(1) }}
      variant="overline"
    >
      {currentPage * pageSize + 1} - {currentPage * pageSize + pageSize} of N Projects
    </Typography>
  )
}
