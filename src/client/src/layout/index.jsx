import { useState } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Header from './header'
import Routes from './routes'
import Footer from './footer'

export default props => {
  const [ref, setRef] = useState(null)

  return (
    <Router>
      <Header {...props} ref={el => setRef(el)} />
      {ref && (
        <div style={{ position: 'relative', minHeight: `calc(100% - ${ref.offsetHeight}px)` }}>
          <Routes />
          <Footer />
        </div>
      )}
    </Router>
  )
}
