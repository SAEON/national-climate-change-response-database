import IconButton from '@material-ui/core/IconButton'
import Icon from 'mdi-react/ChevronRightIcon'
import Tooltip from '@material-ui/core/Tooltip'
import { useContext } from 'react'
import { context as resultContext } from '../../context'

export default () => {
  const { nextPage } = useContext(resultContext)

  return (
    <Tooltip title="Go to next page">
      <span>
        <IconButton onClick={nextPage} size="small">
          <Icon size={18} />
        </IconButton>
      </span>
    </Tooltip>
  )
}
