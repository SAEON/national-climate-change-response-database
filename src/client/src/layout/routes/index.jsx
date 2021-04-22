import { lazy } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import Transition from './_transition'

const HomePage = lazy(() => import('../../pages/home'))
const LoginPage = lazy(() => import('../../pages/login'))
const AccessPage = lazy(() => import('../../pages/access'))
const ProjectsPage = lazy(() => import('../../pages/projects'))
const ProjectWizardPage = lazy(() => import('../../pages/project-wizard'))
const TenantsPage = lazy(() => import('../../pages/tenants'))

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

      {/* TENANTS */}
      <Route
        key={'tenants'}
        path={'/tenants'}
        exact
        render={() => (
          <Transition>
            <TenantsPage />
          </Transition>
        )}
      />

      {/* NEW PROJECT WIZARD */}
      <Route
        key={'new-project-wizard'}
        path={'/projects/submission'}
        exact
        render={() => (
          <Transition>
            <ProjectWizardPage />
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
