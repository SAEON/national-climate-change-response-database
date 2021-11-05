import { Route, Switch, withRouter } from 'react-router-dom'

export default withRouter(({ routes }) => {
  return (
    <Switch key={location.pathname || '/'}>
      {routes.map(({ label: key, to: path, exact, render }) => (
        <Route key={key} path={path} exact={exact} render={render} />
      ))}
    </Switch>
  )
})
