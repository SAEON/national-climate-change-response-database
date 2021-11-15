import { useState, lazy, Suspense } from 'react'
import Dialog from '@mui/material/Dialog'
import Provider from './_context'
import Loading from '../../../../../components/loading'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Icon from 'mdi-react/AccountMultiplePlusIcon'
import Mutation from './_mutation'

const Form = lazy(() => import('./_form'))

const OpenDialog = ({ setOpen }) => {
  return (
    <Provider>
      <DialogTitle>New application tenant</DialogTitle>
      <DialogContent>
        <Suspense fallback={<Loading />}>
          <Form />
        </Suspense>
      </DialogContent>
      <DialogActions>
        <Mutation setOpen={setOpen} />
      </DialogActions>
    </Provider>
  )
}

export default () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <OpenDialog setOpen={setOpen} />
      </Dialog>

      {/* TOGGLE */}
      <Tooltip title="Add application tenant">
        <Button onClick={() => setOpen(true)} variant="text" startIcon={<Icon size={18} />}>
          Add tenant
        </Button>
      </Tooltip>
    </>
  )
}
