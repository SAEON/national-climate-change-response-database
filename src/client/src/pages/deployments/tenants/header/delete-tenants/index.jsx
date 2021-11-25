import { useState, useContext } from 'react'
import { context as tenantsContext } from '../../_context'
import { gql, useMutation } from '@apollo/client'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Tooltip from '@mui/material/Tooltip'
import Icon from 'mdi-react/DeleteIcon'
import CancelIcon from 'mdi-react/CancelIcon'
import AcceptIcon from 'mdi-react/TickIcon'
import DialogContent from '@mui/material/DialogContent'
import CircularProgress from '@mui/material/CircularProgress'

const Dialog_ = ({ selectedRows }) => {
  const [open, setOpen] = useState(false)
  const [deleteTenants, { error, loading }] = useMutation(
    gql`
      mutation deleteTenants($ids: [ID!]!) {
        deleteTenants(ids: $ids)
      }
    `,
    {
      update: (cache, { data: { deleteTenants: ids } }) => {
        for (const id of ids) {
          cache.evict({ id: `Tenant:${id}` })
          setOpen(false)
        }
      },
    }
  )

  if (error) {
    throw error
  }

  return (
    <>
      {/* DIALOG */}

      <Dialog
        PaperProps={{ style: { flexGrow: 1 } }}
        scroll="paper"
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="delete-deployment-dialogue"
      >
        <DialogTitle color="primary" style={{ textAlign: 'center' }}>
          Delete tenants
        </DialogTitle>
        <DialogContent dividers>
          Are you sure you want to delete the ({selectedRows.size}) selected tenants? Data and users
          will NOT be deleted, and will still be viewable in any tenant that subsets the deleted
          tenants data (in terms of a tenants geofence). The theme / logo / flag / frontmatter
          content will be deleted and NOT be recoverable.
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            onClick={() => setOpen(false)}
            variant="text"
            startIcon={<CancelIcon size={18} />}
          >
            Cancel
          </Button>
          <Button
            onClick={() =>
              deleteTenants({
                variables: {
                  ids: [...selectedRows],
                },
              })
            }
            variant="text"
            size="small"
            startIcon={loading ? <CircularProgress size={14} /> : <AcceptIcon size={18} />}
          >
            {loading ? 'Loading' : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* TOGGLE */}
      <Tooltip title="Remove application tenant(s)">
        <span>
          <Button
            disabled={selectedRows.size < 1}
            size="small"
            onClick={() => setOpen(true)}
            variant="text"
            startIcon={<Icon size={18} />}
          >
            Delete tenant(s)
          </Button>
        </span>
      </Tooltip>
    </>
  )
}

export default () => {
  const { selectedRows } = useContext(tenantsContext)
  return <Dialog_ selectedRows={selectedRows} />
}
