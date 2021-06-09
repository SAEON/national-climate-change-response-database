import IconButton from '@material-ui/core/IconButton'
import Icon from 'mdi-react/ChevronLeftIcon'
import Tooltip from '@material-ui/core/Tooltip'
import { useContext } from 'react'
import { context as resultContext } from '../../context'

export default () => {
  const { previousPage } = useContext(resultContext)

  return (
    <Tooltip title="Go to previous page">
      <span>
        <IconButton disabled={!previousPage} onClick={previousPage} size="small">
          <Icon size={18} />
        </IconButton>
      </span>
    </Tooltip>
  )
}
