import { lazy, Suspense } from 'react'
import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'
import ContentNav from '../../components/content-nav'
import Avatar from '@material-ui/core/Avatar'
import Fade from '@material-ui/core/Fade'
import Loading from '../../components/loading'
import makeStyles from '@material-ui/core/styles/makeStyles'
import clsx from 'clsx'

const Details = lazy(() => import('./details'))
const Mitigation = lazy(() => import('./mitigation'))
const Adaptation = lazy(() => import('./adaptation'))
const Research = lazy(() => import('./research'))
const Submit = lazy(() => import('./submit'))

const useStyles = makeStyles(theme => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}))

const AvatarIcon = ({ i }) => {
  const classes = useStyles()
  return <Avatar className={clsx(classes.small)}>{i}</Avatar>
}

export default () => {
  return (
    <Container>
      <Box my={2}>
        <ContentNav
          title="new-project"
          navItems={[
            {
              primaryText: 'Project',
              secondaryText: 'Basic project details',
              Icon: () => <AvatarIcon i={1} />,
            },
            {
              primaryText: 'Mitigation',
              secondaryText: 'Project mitigation details',
              Icon: () => <AvatarIcon i={2} />,
            },
            {
              primaryText: 'Adaptation',
              secondaryText: 'Project adaptation details',
              Icon: () => <AvatarIcon i={3} />,
            },
            {
              primaryText: 'Research',
              secondaryText: 'Project research details',
              Icon: () => <AvatarIcon i={4} />,
            },
            {
              primaryText: 'Submit',
              secondaryText: 'Submit project for review',
              Icon: () => <AvatarIcon i={5} />,
            },
          ]}
        >
          {({ activeIndex }) => {
            return (
              <div style={{ position: 'relative' }}>
                <Fade key={0} unmountOnExit in={activeIndex === 0}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <Suspense fallback={<Loading />}>
                      <Details />
                    </Suspense>
                  </div>
                </Fade>
                <Fade key={1} unmountOnExit in={activeIndex === 1}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <Suspense fallback={<Loading />}>
                      <Mitigation />
                    </Suspense>
                  </div>
                </Fade>
                <Fade key={2} unmountOnExit in={activeIndex === 2}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <Suspense fallback={<Loading />}>
                      <Adaptation />
                    </Suspense>
                  </div>
                </Fade>
                <Fade key={3} unmountOnExit in={activeIndex === 3}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <Suspense fallback={<Loading />}>
                      <Research />
                    </Suspense>
                  </div>
                </Fade>
                <Fade key={4} unmountOnExit in={activeIndex === 4}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
                    <Suspense fallback={<Loading />}>
                      <Submit />
                    </Suspense>
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
