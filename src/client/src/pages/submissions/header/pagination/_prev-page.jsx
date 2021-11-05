import IconButton from '@mui/material/IconButton'
import Icon from 'mdi-react/ChevronLeftIcon'
import Tooltip from '@mui/material/Tooltip'
import { useContext } from 'react'
import { context as resultContext } from '../../context'

export default () => {
  const { previousPage, hasPreviousPage } = useContext(resultContext)

  return (
    <Tooltip title={hasPreviousPage ? 'Go to previous page' : '(No previous page)'}>
      <span>
        <IconButton disabled={!hasPreviousPage} onClick={previousPage} size="small">
          <Icon size={18} />
        </IconButton>
      </span>
    </Tooltip>
  )
}
