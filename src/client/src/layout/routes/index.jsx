import { lazy } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import Transition from './_transition'

const HomePage = lazy(() => import('../../pages/home'))
const AccessPage = lazy(() => import('../../pages/access'))
const ProjectsPage = lazy(() => import('../../pages/projects'))
const ProjectPage = lazy(() => import('../../pages/project'))
const SubmitProjectPage = lazy(() => import('../../pages/submit-project'))
const DeploymentsPage = lazy(() => import('../../pages/deployments'))

export default withRouter(() => {
  return (
    <Switch key={location.pathname || '/'}>
      {/* HOME */}
      <Route
        key={'home'}
        path={'/'}
        exact
        render={() => (
          <Transition tKey="home">
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
          <Transition tKey="access">
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
          <Transition tKey="projects">
            <ProjectsPage />
          </Transition>
        )}
      />

      {/* NEW PROJECT WIZARD */}
      <Route
        key={'submit-project'}
        path={'/projects/submission'}
        exact
        render={() => (
          <Transition tKey="wizard">
            <SubmitProjectPage />
          </Transition>
        )}
      />

      {/* PROJECT */}
      <Route
        key={'project'}
        path={'/projects/:id+'}
        exact
        render={props => (
          <Transition tKey="project">
            <ProjectPage id={props.match.params.id} {...props} />
          </Transition>
        )}
      />

      {/* DEPLOYMENTS */}
      <Route
        key={'deployments'}
        path={'/deployments'}
        exact
        render={() => (
          <Transition tKey="deployments">
            <DeploymentsPage />
          </Transition>
        )}
      />
    </Switch>
  )
})
