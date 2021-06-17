import { lazy } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import Transition from './_transition'

const HomePage = lazy(() => import('../../pages/home'))
const AccessPage = lazy(() => import('../../pages/access'))
const ProjectsPage = lazy(() => import('../../pages/projects'))
const ProjectPage = lazy(() => import('../../pages/project'))
const EditProjectPage = lazy(() => import('../../pages/edit-project'))
const SubmitProjectPage = lazy(() => import('../../pages/submit-project'))
const DeploymentsPage = lazy(() => import('../../pages/deployments'))
const UserProjectsPage = lazy(() => import('../../pages/user-projects'))
const UsersPage = lazy(() => import('../../pages/users'))

export default withRouter(() => {
  return (
    <Switch key={location.pathname || '/'}>
      {/* HOME */}
      <Route
        key={'home'}
        path={'/'}
        exact
        render={() => (
          <Transition nowrap tKey="home">
            <HomePage />
          </Transition>
        )}
      />

      {/* USER PROJECTs */}
      <Route
        key={'user-projects'}
        path={'/users/:id/projects'}
        exact
        render={props => (
          <Transition nowrap tKey="user-projects">
            <UserProjectsPage id={props.match.params.id} {...props} />
          </Transition>
        )}
      />

      {/* USERs */}
      <Route
        key={'users'}
        path={'/users'}
        render={() => (
          <Transition nowrap tKey="users">
            <UsersPage />
          </Transition>
        )}
      />

      {/* ACCESS */}
      <Route
        key={'access'}
        path={'/access'}
        exact
        render={() => (
          <Transition nowrap tKey="access">
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
          <Transition nowrap tKey="projects">
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
          <Transition nowrap tKey="wizard">
            <SubmitProjectPage />
          </Transition>
        )}
      />

      {/* EDIT PROJECT */}
      <Route
        key={'edit-project'}
        path={'/projects/:id/edit'}
        exact
        render={props => (
          <Transition tKey="edit-project">
            <EditProjectPage id={props.match.params.id} {...props} />
          </Transition>
        )}
      />

      {/* PROJECT */}
      <Route
        key={'project'}
        path={'/projects/:id+'}
        exact
        render={props => (
          <Transition nowrap tKey="project">
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
          <Transition nowrap tKey="deployments">
            <DeploymentsPage />
          </Transition>
        )}
      />
    </Switch>
  )
})
