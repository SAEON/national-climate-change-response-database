import { useContext, lazy, Suspense, useMemo, useState } from 'react'
import { context as authenticationContext } from '../../contexts/authentication'
import { context as authorizationContext } from '../../contexts/authorization'
import Loading from '../../components/loading'
import Container from '@mui/material/Container'
import AccessDenied from '../../components/access-denied'
import VerticalTabs from '../../packages/vertical-tabs'
import Header from './header'
import useTheme from '@mui/material/styles/useTheme'
import ExcelIcon from 'mdi-react/MicrosoftExcelIcon'
import Fade from '@mui/material/Fade'
import TenantIcon from 'mdi-react/AccountGroupIcon'

const ExcelTemplates = lazy(() => import('./excel-templates'))
const Tenants = lazy(() => import('./tenants'))

const _sections = [
  {
    primaryText: 'Excel templates',
    secondaryText: 'Submission form for offline use (.xlsm)',
    Icon: () => <ExcelIcon />,
    Render: ExcelTemplates,
    requiredPermission: '/deployment',
  },
  {
    primaryText: 'Tenants',
    secondaryText: 'Provincial deployment',
    Icon: () => <TenantIcon />,
    Render: Tenants,
    requiredPermission: '/deployment',
  },
]

export default () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [ref, setRef] = useState(null)
  const theme = useTheme()
  const isAuthenticated = useContext(authenticationContext).authenticate()
  const { hasPermission } = useContext(authorizationContext)

  const sections = useMemo(
    () =>
      _sections.map(({ requiredPermission, ...otherProps }) => ({
        ...otherProps,
        requiredPermission,
        disabled: !hasPermission(requiredPermission),
      })),
    [hasPermission]
  )

  if (!isAuthenticated) {
    return <Loading />
  }

  if (!hasPermission('/deployment')) {
    return <AccessDenied requiredPermission="/deployment" />
  }

  return (
    <>
      <Header ref={el => setRef(el)} />
      <div style={{ marginTop: theme.spacing(2) }} />
      <Container style={{ minHeight: 1000 }}>
        <VerticalTabs activeIndex={activeIndex} setActiveIndex={setActiveIndex} navItems={sections}>
          {sections.map(({ requiredPermission, Render, primaryText, disabled }, i) => {
            return (
              <Suspense key={primaryText} fallback={<Loading />}>
                <Fade in={activeIndex === i} key={`loaded-${i}`}>
                  <span style={{ display: activeIndex === i ? 'inherit' : 'none' }}>
                    {disabled ? (
                      <AccessDenied noContainer requiredPermission={requiredPermission} />
                    ) : (
                      <Render headerRef={ref} active={activeIndex === i} />
                    )}
                  </span>
                </Fade>
              </Suspense>
            )
          })}
        </VerticalTabs>
      </Container>
      <div style={{ marginTop: theme.spacing(2) }} />
    </>
  )
}
