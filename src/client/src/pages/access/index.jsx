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
    requiredPermission: 'view-users',
    Section: Users,
  },
  {
    primaryText: 'Roles',
    secondaryText: 'Manage application roles',
    Icon: RolesIcon,
    requiredPermission: 'view-roles',
    Section: Roles,
  },
  {
    primaryText: 'Permissions',
    secondaryText: 'Manage application permissions',
    Icon: PermissionsIcon,
    requiredPermission: 'view-permissions',
    Section: Permissions,
  },
]

export default () => {
  const isAuthenticated = useContext(authenticationContext).authenticate()
  const { hasPermission } = useContext(authorizationContext)

  if (!isAuthenticated) {
    return <Loading />
  }

  if (!hasPermission('view-/access')) {
    return (
      <Wrapper>
        <AccessDenied requiredPermission="Admin" />
      </Wrapper>
    )
  }

  return (
    <UserRolesProvider>
      <ToolbarHeader />
      <Wrapper>
        <ContentNav
          navItems={sections.filter(({ requiredPermission }) => hasPermission(requiredPermission))}
        >
          {({ activeIndex }) => {
            return sections
              .filter(({ requiredPermission }) => hasPermission(requiredPermission))
              .map(({ Section, primaryText, requiredPermission }, i) =>
                activeIndex === i ? (
                  <Section permission={requiredPermission} key={primaryText} />
                ) : null
              )
          }}
        </ContentNav>
      </Wrapper>
    </UserRolesProvider>
  )
}
