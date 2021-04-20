import { lazy } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import Transition from './_transition'

const HomePage = lazy(() => import('../../pages/home'))
const LoginPage = lazy(() => import('../../pages/login'))
const AccessPage = lazy(() => import('../../pages/access'))
const ProjectsPage = lazy(() => import('../../pages/projects'))
const ProjectWizard = lazy(() => import('../../pages/project-wizard'))

export default withRouter(() => {
  return (
    <Switch key={location.pathname || '/'}>
      {/* HOME */}
      <Route
        key={'home'}
        path={'/'}
        exact
        render={() => (
          <Transition>
            <HomePage />
          </Transition>
        )}
      />

      {/* ACCESS */}
      <Route
        key={'access'}
        path={'/access'}
        exact
        render={() => (
          <Transition>
            <AccessPage />
          </Transition>
        )}
      />

      {/* PROJECTS */}
      <Route
        key={'projects'}
        path={'/projects'}
        exact
        render={() => (
          <Transition>
            <ProjectsPage />
          </Transition>
        )}
      />

      {/* NEW PROJECT WIZARD */}
      <Route
        key={'new-project-wizard'}
        path={'/projects/new'}
        exact
        render={() => (
          <Transition>
            <ProjectWizard />
          </Transition>
        )}
      />

      {/* LOGIN */}
      <Route
        key={'login'}
        path={'/login'}
        exact
        render={() => (
          <Transition>
            <LoginPage />
          </Transition>
        )}
      />
    </Switch>
  )
})
