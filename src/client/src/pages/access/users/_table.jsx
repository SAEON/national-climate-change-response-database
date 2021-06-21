import { useContext } from 'react'
import { context as userRoleContext } from '../context'
import { gql, useMutation } from '@apollo/client'
import { DataGrid } from '@material-ui/data-grid'
import useTheme from '@material-ui/core/styles/useTheme'
import Multiselect from '../../../components/multiselect'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import clsx from 'clsx'
import useStyles from './style'

export default ({ users }) => {
  const { roles } = useContext(userRoleContext)
  const theme = useTheme()
  const classes = useStyles()

  const [assignUserRoles, { error, loading }] = useMutation(
    gql`
      mutation assignUserRoles($userId: Int!, $roleIds: [Int!]!) {
        assignUserRoles(userId: $userId, roleIds: $roleIds) {
          id
          roles {
            id
          }
        }
      }
    `
  )

  if (error) {
    throw error
  }

  return (
    <>
      <Card
        style={{ width: '100%', backgroundColor: theme.backgroundColor, border: 'none' }}
        variant="outlined"
      >
        <CardContent style={{ padding: 0 }}>
          <div style={{ height: 1000 }}>
            <DataGrid
              pageSize={25}
              rowHeight={theme.spacing(5)}
              rows={users.map(({ id, emailAddress, name, familyName, roles }) => {
                return {
                  id,
                  emailAddress,
                  name,
                  familyName,
                  roles,
                }
              })}
              columns={[
                {
                  field: 'id',
                  sortable: false,
                  filterable: false,
                  disableColumnMenu: true,
                  headerName: 'ID',
                  width: 50,
                },
                { field: 'emailAddress', headerName: 'Email Address', flex: 0.5 },
                { field: 'name', headerName: 'Name', flex: 0.5 },
                { field: 'familyName', headerName: 'Family name', flex: 0.5 },
                {
                  field: 'roles',
                  headerName: 'Roles',
                  sortable: false,
                  filterable: false,
                  flex: 0.8,
                  disableColumnMenu: true,
                  cellClassName: () => clsx(classes.cell),
                  renderCell: ({ value, row: { id: userId } }) => {
                    return (
                      <Multiselect
                        loading={loading}
                        chipProps={{
                          variant: 'outlined',
                          color: label => (label.includes('admin') ? 'secondary' : 'primary'),
                          style: { textTransform: 'uppercase', position: 'relative', top: -2 },
                        }}
                        id={`multiselect-${userId}`}
                        options={roles
                          .filter(({ name }) => name !== 'sysadmin')
                          .map(({ name }) => name)}
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
