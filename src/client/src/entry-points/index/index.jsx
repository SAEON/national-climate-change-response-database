import '../../index/main'
import { render } from 'react-dom'
import RouteSwitcher from '../../index/route-switcher'
import Application from '../../index/application'
import routes from './routes'
import { SizeContent } from '../../contexts/layout'
import Header from '../../components/header'
import Footer from '../../components/footer'

const Entry = () => {
  return (
    <>
      <Header />
      <SizeContent>
        <RouteSwitcher />
      </SizeContent>
      <Footer />
    </>
  )
}

render(
  <Application routes={routes}>
    <Entry />
  </Application>,
  document.getElementById('root')
)
