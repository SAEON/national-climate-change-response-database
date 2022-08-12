import { useContext, lazy, Suspense, useMemo, useState } from 'react'
import { context as authenticationContext } from '../../contexts/authentication'
import { context as authorizationContext } from '../../contexts/authorization'
import Loading from '../../components/loading'
import Container from '@mui/material/Container'
import AccessDenied from '../../components/access-denied'
import VerticalTabs from '../../packages/vertical-tabs'
import Header from './header'
import Fade from '@mui/material/Fade'
import TenantIcon from 'mdi-react/AccountGroupIcon'
import WarningIcon from 'mdi-react/AlertIcon'
import { Div, Span } from '../../components/html-tags'

const Tenants = lazy(() => import('./tenants'))
const FlaggedVocabularies = lazy(() => import('./flagged-vocabularies'))

const _sections = [
  {
    primaryText: 'Tenants',
    secondaryText: 'Provincial deployment',
    Icon: () => <TenantIcon />,
    Render: Tenants,
    requiredPermission: '/deployment',
  },
  {
    primaryText: 'Flagged vocabularies',
    secondaryText:
      'Fix outdated vocabulary terms to be consistent with controlled vocabulary trees',
    Icon: () => <WarningIcon />,
    Render: FlaggedVocabularies,
    requiredPermission: '/deployment',
  },
]

export default () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [ref, setRef] = useState(null)
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
      <Div sx={{ marginTop: theme => theme.spacing(2) }} />
      <Container sx={{ minHeight: 1000 }}>
        <VerticalTabs activeIndex={activeIndex} setActiveIndex={setActiveIndex} navItems={sections}>
          {sections.map(({ requiredPermission, Render, primaryText, disabled }, i) => {
            return (
              <Suspense
                key={primaryText}
                fallback={
                  <Div
                    sx={{
                      marginBottom: theme => theme.spacing(2),
                    }}
                  >
                    <Loading />
                  </Div>
                }
              >
                <Fade in={activeIndex === i} key={`loaded-${i}`}>
                  <Span sx={{ display: activeIndex === i ? 'inherit' : 'none' }}>
                    {disabled ? (
                      <AccessDenied noContainer requiredPermission={requiredPermission} />
                    ) : (
                      <Render headerRef={ref} active={activeIndex === i} />
                    )}
                  </Span>
                </Fade>
              </Suspense>
            )
          })}
        </VerticalTabs>
      </Container>
      <Div sx={{ marginTop: theme => theme.spacing(2) }} />
    </>
  )
}
