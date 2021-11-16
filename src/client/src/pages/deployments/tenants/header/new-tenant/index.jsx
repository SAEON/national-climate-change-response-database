import { useState, useContext, lazy, Suspense } from 'react'
import { context as themeContext } from '../../../../../contexts/theme'
import Dialog from '@mui/material/Dialog'
import Provider from './_context'
import Loading from '../../../../../components/loading'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Icon from 'mdi-react/AccountMultiplePlusIcon'
import CancelIcon from 'mdi-react/CancelIcon'
import Mutation from './_mutation'
import Paper from '@mui/material/Paper'
import Draggable from 'react-draggable'

function PaperComponent(props) {
  return (
    <Draggable handle="#new-deployment-dialogue" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  )
}

const Form = lazy(() => import('./form'))

const ToggleDialog = ({ staticTheme }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* DIALOG */}
      <Provider staticTheme={staticTheme}>
        <Dialog
          PaperComponent={PaperComponent}
          PaperProps={{ style: { flexGrow: 1 } }}
          scroll="paper"
          maxWidth="lg"
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="new-deployment-dialogue"
        >
          <DialogTitle
            color="primary"
            style={{ cursor: 'move', textAlign: 'center' }}
            id="new-deployment-dialogue"
          >
            New deployment
          </DialogTitle>
          <Suspense fallback={<Loading />}>
            <Form />
          </Suspense>
          <DialogActions>
            <Button
              size="small"
              onClick={() => setOpen(false)}
              variant="text"
              startIcon={<CancelIcon size={18} />}
            >
              Cancel
            </Button>
            <Mutation setOpen={setOpen} />
          </DialogActions>
        </Dialog>
      </Provider>

      {/* TOGGLE */}
      <Tooltip title="Add application tenant">
        <Button
          size="small"
          onClick={() => setOpen(true)}
          variant="text"
          startIcon={<Icon size={18} />}
        >
          Add tenant
        </Button>
      </Tooltip>
    </>
  )
}

export default () => {
  const { staticTheme } = useContext(themeContext)
  return <ToggleDialog staticTheme={staticTheme} />
}
