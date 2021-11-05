import { useContext, Suspense, lazy } from 'react'
import { context as authenticationContext } from '../../contexts/authentication'
import { context as authorizationContext } from '../../contexts/authorization'
import Loading from '../../components/loading'
import ContentNav from '../../components/content-nav'
import UsersIcon from 'mdi-react/AccountMultipleIcon'
import RolesIcon from 'mdi-react/AccountLockIcon'
import PermissionsIcon from 'mdi-react/AxisLockIcon'
import Wrapper from '../../components/page-wrapper'
import ToolbarHeader from '../../components/toolbar-header'
import AccessDenied from '../../components/access-denied'
import UserRolesProvider from './context'
import { useTheme } from '@mui/material/styles'
import Fade from '@mui/material/Fade'

const Users = lazy(() => import('./users'))
const Roles = lazy(() => import('./roles'))
const Permissions = lazy(() => import('./permissions'))

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
  const theme = useTheme()
  const isAuthenticated = useContext(authenticationContext).authenticate()
  const { hasPermission } = useContext(authorizationContext)

  if (!isAuthenticated) {
    return <Loading />
  }

  if (!hasPermission('/access')) {
    return (
      <Wrapper>
        <AccessDenied requiredPermission="/access" />
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
          {({ activeIndex }) =>
            sections
              .filter(({ requiredPermission }) => hasPermission(requiredPermission))
              .map(({ Section, primaryText, requiredPermission }, i) => (
                <Suspense
                  key={primaryText}
                  fallback={
                    <Fade
                      timeout={theme.transitions.duration.regular}
                      in={activeIndex === i}
                      key={'loading'}
                    >
                      <span>
                        <Loading />
                      </span>
                    </Fade>
                  }
                >
                  <Fade
                    timeout={theme.transitions.duration.regular}
                    in={activeIndex === i}
                    key={'loaded'}
                  >
                    <span style={{ display: activeIndex === i ? 'inherit' : 'none' }}>
                      <Section permission={requiredPermission} />
                    </span>
                  </Fade>
                </Suspense>
              ))
          }
        </ContentNav>
      </Wrapper>
    </UserRolesProvider>
  )
}
