import '../../index/main'
import { render } from 'react-dom'
import RouteSwitcher from '../../index/route-switcher'
import Application from '../../index/application'
import routes from './routes'
import { SizeContent } from '../../contexts/layout'
import Header from '../../components/header'
import { NCCRD_DEPLOYMENT_ENV } from '../../config'
import Footer from '../../components/footer'

render(
  <Application>
    <Header
      title={`National Climate Change Response Database ${
        NCCRD_DEPLOYMENT_ENV === 'production' ? '' : `(dev)`
      }`}
      routes={routes}
    />
    <SizeContent>
      <RouteSwitcher routes={routes} />
    </SizeContent>
    <Footer routes={routes} />
  </Application>,
  document.getElementById('root')
)
