import { useContext } from 'react'
import { context as userRoleContext } from '../context'
import { gql, useMutation } from '@apollo/client'
import { DataGrid } from '@material-ui/data-grid'
import useTheme from '@material-ui/core/styles/useTheme'
import Multiselect from '../../../components/multiselect'
import Loading from '../../../components/loading'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import clsx from 'clsx'
import useStyles from './style'

export default ({ users }) => {
  const { roles } = useContext(userRoleContext)
  const theme = useTheme()
  const classes = useStyles()

  const [assignUserRoles, { error, loading }] = useMutation(gql`
    mutation assignUserRoles($userId: Int!, $roleIds: [Int!]!) {
      assignUserRoles(userId: $userId, roleIds: $roleIds) {
        id
      }
    }
  `)

  if (error) {
    throw error
  }

  return (
    <>
      {loading && (
        <div style={{ position: 'absolute', width: '100%' }}>
          <Loading />
        </div>
      )}
      <Card style={{ width: '100%', backgroundColor: theme.backgroundColor }} variant="outlined">
        <CardContent style={{ padding: 0 }}>
          <div style={{ height: 800 }}>
            <DataGrid
              rowHeight={theme.spacing(6)}
              rows={users.map(({ id, emailAddress, roles }) => {
                return {
                  id,
                  emailAddress,
                  roles: roles,
                }
              })}
              columns={[
                { field: 'id', headerName: 'ID', width: 90 },
                { field: 'emailAddress', headerName: 'Email Address', width: 350 },
                {
                  field: 'roles',
                  headerName: 'Roles',
                  sortable: false,
                  width: 400,
                  cellClassName: () => clsx(classes.cell),
                  renderCell: ({ value, row: { id: userId } }) => {
                    return (
                      <Multiselect
                        chipProps={{ variant: 'outlined', style: { textTransform: 'uppercase' } }}
                        id={`multiselect-${userId}`}
                        options={roles.map(({ name }) => name)}
                        value={value.map(({ name }) => name)}
                        setValue={roleNames => {
                          assignUserRoles({
                            variables: {
                              userId,
                              roleIds:
                                roleNames.map(
                                  _name => roles.find(({ name }) => name === _name).id
                                ) || [],
                            },
                          })
                        }}
                      />
                    )
                  },
                },
              ]}
              checkboxSelection
            />
          </div>
        </CardContent>
      </Card>
    </>
  )
}
