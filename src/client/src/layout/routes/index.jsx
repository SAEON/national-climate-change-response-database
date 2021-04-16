import { lazy } from 'react'
import { Route, Switch, withRouter } from 'react-router-dom'
import Transition from './_transition'

const HomePage = lazy(() => import('../../pages/home'))
const LoginPage = lazy(() => import('../../pages/login'))
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
          <Transition>
            <HomePage />
          </Transition>
        )}
      />

      {/* USERS */}
      <Route
        key={'users'}
        path={'/users'}
        exact
        render={() => (
          <Transition>
            <UsersPage />
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
