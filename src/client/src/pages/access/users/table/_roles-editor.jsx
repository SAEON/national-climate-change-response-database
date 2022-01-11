import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { gql, useMutation } from '@apollo/client'
import QuickForm from '../../../../components/quick-form'

export default ({ row: user, onClose, roles }) => {
  const userId = user.id

  const [assignRolesToUser, { error, loading }] = useMutation(
    gql`
      mutation assignRolesToUser($userId: Int!, $roleIds: [Int!]!) {
        assignRolesToUser(userId: $userId, roleIds: $roleIds) {
          id
          roles {
            id
          }
        }
      }
    `,
    {
      onCompleted: () => {
        onClose()
      },
    }
  )

  if (error) {
    throw error
  }

  return (
    <QuickForm
      tenantRoles={user.context.map(({ id, roles }) => ({
        tenantId: id,
        roleIds: roles.map(({ id }) => id),
      }))}
    >
      {(update, { tenantRoles }) => {
        return (
          <Dialog
            scroll="paper"
            maxWidth="xl"
            onClose={(e, reason) => {
              if (reason) {
                return
              }
              onClose()
            }}
            open={true}
          >
            <DialogTitle>Edit user roles</DialogTitle>
            <DialogContent dividers={true}>hi</DialogContent>
            <DialogActions>
              <Button disabled={loading} onClick={() => onClose()} size="small" variant="text">
                Cancel
              </Button>
              <Button disabled={loading} onClick={() => {}} size="small" variant="text">
                Okay
              </Button>
            </DialogActions>
          </Dialog>
        )
      }}
    </QuickForm>
  )

  return (
    <QuickForm roleIds={user.roles.map(({ id }) => id)}>
      {(update, { roleIds }) => (
        <Dialog
          scroll="paper"
          maxWidth="xl"
          onClose={(e, reason) => {
            if (reason) {
              return
            }
            onClose()
          }}
          open={true}
        >
          <DialogTitle>Edit user roles</DialogTitle>
          <DialogContent dividers={true}>
            <FormGroup>
              {[...roles]
                .sort(({ name: a }, { name: b }) => {
                  if (a > b) return 1
                  if (a < b) return -1
                  return 0
                })
                .map(({ id, name }) => {
                  return (
                    <FormControlLabel
                      key={name}
                      control={
                        <Checkbox
                          onChange={({ target: { checked } }) => {
                            update({
                              roleIds: checked
                                ? [...roleIds, id]
                                : roleIds.filter(id_ => id_ !== id),
                            })
                          }}
                          disabled={name === 'sysadmin'}
                          checked={roleIds.includes(id)}
                        />
                      }
                      label={name.toUpperCase()}
                    />
                  )
                })}
            </FormGroup>
          </DialogContent>
          <DialogActions>
            <Button disabled={loading} onClick={() => onClose()} size="small" variant="text">
              Cancel
            </Button>
            <Button
              disabled={loading}
              onClick={() => {
                assignRolesToUser({
                  variables: {
                    userId,
                    roleIds,
                  },
                })
              }}
              size="small"
              variant="text"
            >
              Okay
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </QuickForm>
  )
}
