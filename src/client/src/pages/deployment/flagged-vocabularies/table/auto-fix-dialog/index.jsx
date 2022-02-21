import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import FixIcon_ from 'mdi-react/AutoFixIcon'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import OpenDialog from './_open-dialog'

const FixIcon = styled(FixIcon_)({})

export default props => {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <OpenDialog setOpen={setOpen} {...props} />
      </Dialog>

      {/* TOGGLE */}
      <Tooltip placement="left-start" title="Auto fix all of these cases">
        <IconButton onClick={() => setOpen(true)} size="small">
          <FixIcon size={18} />
        </IconButton>
      </Tooltip>
    </div>
  )
}
