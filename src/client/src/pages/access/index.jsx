import { useContext } from 'react'
import { context as authenticationContext } from '../../contexts/authentication'
import { context as authorizationContext } from '../../contexts/authorization'
import Loading from '../../components/loading'
import ContentNav from '../../components/content-nav'
import UsersIcon from 'mdi-react/AccountMultipleIcon'
import RolesIcon from 'mdi-react/AccountLockIcon'
import PermissionsIcon from 'mdi-react/AxisLockIcon'
import Users from './users'
import Roles from './roles'
import Permissions from './permissions'
import Wrapper from '../../components/page-wrapper'
import ToolbarHeader from '../../components/toolbar-header'
import AccessDenied from '../../components/access-denied'
import UserRolesProvider from './context'

const navItems = [
  {
    primaryText: 'Users',
    secondaryText: 'Manage users directly',
    Icon: UsersIcon,
    access: 'admin',
    Component: Users,
  },
  {
    primaryText: 'Roles',
    secondaryText: 'Assign users to roles',
    Icon: RolesIcon,
    access: 'admin',
    Component: Roles,
  },
  {
    primaryText: 'Permissions',
    secondaryText: 'Assign permissions to roles',
    Icon: PermissionsIcon,
    access: 'admin',
    Component: Permissions,
  },
]

export default () => {
  const isAuthenticated = useContext(authenticationContext).authenticate()
  const { isAuthorized } = useContext(authorizationContext)

  if (!isAuthenticated) {
    return <Loading />
  }

  if (!isAuthorized('admin')) {
    return (
      <Wrapper>
        <AccessDenied requiredMinimumRole="admin" />
      </Wrapper>
    )
  }

  return (
    <UserRolesProvider>
      <ToolbarHeader></ToolbarHeader>
      <Wrapper>
        <ContentNav navItems={navItems.filter(({ access }) => isAuthorized(access))}>
          {({ activeIndex }) => {
            return navItems
              .filter(({ access }) => isAuthorized(access))
              .map(({ Component, primaryText, access }, i) =>
                activeIndex === i ? <Component access={access} key={primaryText} /> : null
              )
          }}
        </ContentNav>
      </Wrapper>
    </UserRolesProvider>
  )
}
