import { BrowserRouter as Router } from 'react-router-dom'
import Header from './header'
import Routes from './routes'
import Footer from './footer'

export default props => {
  return (
    <Router>
      <Header {...props} />
      <Routes />
      <Footer />
    </Router>
  )
}
