import { BrowserRouter as Router } from 'react-router-dom'
import Header from './header'
import Routes from './routes'

export default props => {
  return (
    <Router>
      <Header {...props} />
      <Routes />
    </Router>
  )
}
