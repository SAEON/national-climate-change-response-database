import '../../index/main'
import { render } from 'react-dom'
import RouteSwitcher from '../../index/route-switcher'
import Application from '../../index/application'
import routes from './routes'
import { SizeContent } from '../../contexts/layout'

const A = () => <div>hi</div>

render(
  // <Application>
  //   <SizeContent>
  //     <RouteSwitcher routes={routes} />
  //   </SizeContent>
  // </Application>
  <A />,
  document.getElementById('root')
)
