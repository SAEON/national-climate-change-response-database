import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import ContentNav from '../../components/content-nav'
import UsersIcon from 'mdi-react/AccountMultipleIcon'
import RolesIcon from 'mdi-react/AccountLockIcon'
import PermissionsIcon from 'mdi-react/AxisLockIcon'
import Fade from '@material-ui/core/Fade'
import Users from './users'
import Roles from './roles'
import Permissions from './permissions'

export default () => {
  return (
    <Container>
      <Box my={2}>
        <ContentNav
          title="access-managements"
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
              <div style={{ position: 'relative' }}>
                <Fade key={0} unmountOnExit in={activeIndex === 0}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <Users />
                  </div>
                </Fade>
                <Fade key={1} unmountOnExit in={activeIndex === 1}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <Roles />
                  </div>
                </Fade>
                <Fade key={2} unmountOnExit in={activeIndex === 2}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <Permissions />
                  </div>
                </Fade>
              </div>
            )
          }}
        </ContentNav>
      </Box>
    </Container>
  )
}
