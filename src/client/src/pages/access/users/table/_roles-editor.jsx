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
import Toolbar from '@mui/material/Toolbar'
import AppBar from '@mui/material/AppBar'
import useTheme from '@mui/material/styles/useTheme'

export default ({ row: user, onClose, roles, tenants }) => {
  const theme = useTheme()

  const [assignRolesToUser, { error, loading }] = useMutation(
    gql`
      mutation assignRolesToUser($input: [UserTenantRoleInput!]!) {
        assignRolesToUser(input: $input) {
          id
          context {
            id
            roles {
              id
            }
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
      input={user.context.map(({ id, roles }) => ({
        userId: user.id,
        tenantId: parseInt(id, 10),
        roles: roles.map(({ id, name }) => ({ id, name })),
      }))}
    >
      {(update, { input }) => {
        return (
          <Dialog
            scroll="paper"
            maxWidth="sm"
            fullWidth
            onClose={(e, reason) => {
              if (reason) {
                return
              }
              onClose()
            }}
            open={true}
          >
            <DialogTitle>Edit user roles</DialogTitle>
            <DialogContent style={{ margin: 0, padding: 0 }} dividers={true}>
              {tenants.map(({ id: tenantId, hostname }) => (
                <div key={hostname}>
                  <AppBar elevation={0} variant="outlined" position="relative" color="primary">
                    <Toolbar
                      style={{ marginLeft: theme.spacing(3) }}
                      disableGutters
                      variant="dense"
                    >
                      {hostname}
                    </Toolbar>
                  </AppBar>
                  <FormGroup
                    style={{
                      marginBottom: theme.spacing(3),
                      paddingLeft: theme.spacing(3),
                      paddingRight: theme.spacing(3),
                    }}
                  >
                    {[...roles]
                      .sort(({ name: a }, { name: b }) => {
                        if (a > b) return 1
                        if (a < b) return -1
                        return 0
                      })
                      .map(role => {
                        const { id: roleId, name } = role
                        return (
                          <FormControlLabel
                            key={roleId}
                            label={name}
                            control={
                              <Checkbox
                                color="primary"
                                disabled={name === 'sysadmin'}
                                checked={Boolean(
                                  input
                                    .find(({ tenantId: _tenantId }) => tenantId == _tenantId)
                                    ?.roles.find(({ id }) => id === roleId)
                                )}
                                onChange={({ target: { checked } }) => {
                                  /**
                                   * Check if user is already associated
                                   * with tenant, or if it needs to be added
                                   */
                                  if (
                                    !input.find(({ tenantId: _tenantId }) => tenantId == _tenantId)
                                  ) {
                                    return update({
                                      input: [
                                        ...input,
                                        {
                                          userId: user.id,
                                          tenantId: parseInt(tenantId, 10),
                                          roles: [role],
                                        },
                                      ],
                                    })
                                  }

                                  /**
                                   * Otherwise update the existing input
                                   */
                                  return update({
                                    input: input.map(i => {
                                      if (i.tenantId == tenantId) {
                                        if (checked) {
                                          i.roles = [...i.roles, role]
                                        } else {
                                          i.roles = i.roles.filter(({ id }) => id !== roleId)
                                        }
                                      }

                                      return i
                                    }),
                                  })
                                }}
                              />
                            }
                          />
                        )
                      })}
                  </FormGroup>
                </div>
              ))}
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
                      input: input.map(({ roles, ...mutationArgs }) => ({
                        ...mutationArgs,
                        roleIds: roles.map(({ id }) => id),
                      })),
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
        )
      }}
    </QuickForm>
  )
}
