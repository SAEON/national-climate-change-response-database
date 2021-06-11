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

const sections = [
  {
    primaryText: 'Users',
    secondaryText: 'Manage application users',
    Icon: UsersIcon,
    requiredRole: 'admin',
    Component: Users,
  },
  {
    primaryText: 'Roles',
    secondaryText: 'Manage application roles',
    Icon: RolesIcon,
    requiredRole: 'admin',
    Component: Roles,
  },
  {
    primaryText: 'Permissions',
    secondaryText: 'Manage application permissions',
    Icon: PermissionsIcon,
    requiredRole: 'admin',
    Component: Permissions,
  },
]

export default () => {
  const isAuthenticated = useContext(authenticationContext).authenticate()
  const { hasRole } = useContext(authorizationContext)

  if (!isAuthenticated) {
    return <Loading />
  }

  if (!hasRole('admin')) {
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
        <ContentNav navItems={sections.filter(({ requiredRole }) => hasRole(requiredRole))}>
          {({ activeIndex }) => {
            return sections
              .filter(({ requiredRole }) => hasRole(requiredRole))
              .map(({ Component, primaryText, requiredRole }, i) =>
                activeIndex === i ? <Component access={requiredRole} key={primaryText} /> : null
              )
          }}
        </ContentNav>
      </Wrapper>
    </UserRolesProvider>
  )
}
