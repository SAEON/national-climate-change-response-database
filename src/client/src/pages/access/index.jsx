import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import ContentNav from '../../components/content-nav'
import UsersIcon from 'mdi-react/AccountMultipleIcon'
import RolesIcon from 'mdi-react/AccountLockIcon'
import PermissionsIcon from 'mdi-react/AxisLockIcon'
import Users from './users'
import Roles from './roles'
import Permissions from './permissions'

export default () => {
  return (
    <Container>
      <Box my={2}>
        <ContentNav
          navItems={[
            { primaryText: 'Users', secondaryText: 'Manage users directly', Icon: UsersIcon },
            { primaryText: 'Roles', secondaryText: 'Assign users to roles', Icon: RolesIcon },
            {
              primaryText: 'Permissions',
              secondaryText: 'Assign permissions to roles',
              Icon: PermissionsIcon,
            },
          ]}
        >
          {({ activeIndex }) => {
            return (
              <>
                {activeIndex === 0 && <Users key="users" />}
                {activeIndex === 1 && <Roles key="users" />}
                {activeIndex === 2 && <Permissions key="users" />}
              </>
            )
          }}
        </ContentNav>
      </Box>
    </Container>
  )
}
