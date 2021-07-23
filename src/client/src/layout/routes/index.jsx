import { lazy } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import Transition from './_transition'

const HomePage = lazy(() => import('../../pages/home'))
const AccessPage = lazy(() => import('../../pages/access'))
const SubmissionsPage = lazy(() => import('../../pages/submissions'))
const SubmissionPage = lazy(() => import('../../pages/submission'))
const EditSubmissionPage = lazy(() => import('../../pages/submission-edit'))
const CreateSubmission = lazy(() => import('../../pages/submission-create'))
const NewSubmissionPage = lazy(() => import('../../pages/submission-new'))
const DeploymentsPage = lazy(() => import('../../pages/deployments'))
const UserSubmissionsPage = lazy(() => import('../../pages/user-submissions'))
const UserPage = lazy(() => import('../../pages/user'))
const UsersPage = lazy(() => import('../../pages/users'))
const LoginPage = lazy(() => import('../../pages/login'))

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

      {/* LOGIN */}
      <Route
        key={'login'}
        path={'/login'}
        exact
        render={() => (
          <Transition tKey="login">
            <LoginPage />
          </Transition>
        )}
      />

      {/* USER SUBMISSIONs */}
      <Route
        key={'user-submissions'}
        path={'/user/submissions'}
        exact
        render={() => (
          <Transition tKey="user-submissions">
            <UserSubmissionsPage />
          </Transition>
        )}
      />

      {/* USER */}
      <Route
        key={'user'}
        path={'/user'}
        render={() => (
          <Transition tKey="user">
            <UserPage />
          </Transition>
        )}
      />

      {/* USERS */}
      <Route
        key={'users'}
        path={'/users'}
        render={() => (
          <Transition tKey="users">
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
          <Transition tKey="access">
            <AccessPage />
          </Transition>
        )}
      />

      {/* SUBMISSIONS */}
      <Route
        key={'submissions'}
        path={'/submissions'}
        exact
        render={() => (
          <Transition tKey="submissions">
            <SubmissionsPage />
          </Transition>
        )}
      />

      {/* CREATE SUBMISSION */}
      <Route
        key={'submit-submission'}
        path={'/submissions/new'}
        exact
        render={() => (
          <Transition tKey="create-submission">
            <CreateSubmission />
          </Transition>
        )}
      />

      {/* NEW SUBMISSION */}
      <Route
        key={'submit-submission'}
        path={'/submissions/new/:id'}
        exact
        render={props => (
          <Transition tKey="submit-submission">
            <NewSubmissionPage id={props.match.params.id} />
          </Transition>
        )}
      />

      {/* EDIT SUBMISSION */}
      <Route
        key={'edit-submission'}
        path={'/submissions/:id/edit'}
        exact
        render={props => (
          <Transition tKey="edit-submission">
            <EditSubmissionPage id={props.match.params.id} {...props} />
          </Transition>
        )}
      />

      {/* SUBMISSION */}
      <Route
        key={'submission'}
        path={'/submissions/:id'}
        exact
        render={props => (
          <Transition tKey="submission">
            <SubmissionPage id={props.match.params.id} {...props} />
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
