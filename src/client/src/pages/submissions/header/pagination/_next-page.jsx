import IconButton from '@mui/material/IconButton'
import Icon from 'mdi-react/ChevronRightIcon'
import Tooltip from '@mui/material/Tooltip'
import { useContext } from 'react'
import { context as resultContext } from '../../context'
import { Span } from '../../../../components/html-tags'

export default () => {
  const { nextPage, hasNextPage } = useContext(resultContext)

  return (
    <Tooltip title={hasNextPage ? 'Go to next page' : '(No more pages)'}>
      <Span>
        <IconButton disabled={!hasNextPage} onClick={nextPage} size="small">
          <Icon size={18} />
        </IconButton>
      </Span>
    </Tooltip>
  )
}
