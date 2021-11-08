import '../../index/main'
import { render } from 'react-dom'
import RouteSwitcher from '../../index/route-switcher'
import Application from '../../index/application'
import routes from './routes'
import { SizeContent } from '../../contexts/layout'
import Header from '../../components/header'
import { NCCRD_DEPLOYMENT_ENV } from '../../config'
import Footer from '../../components/footer'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

render(
  <Application>
    <Header
      title={
        <Tooltip title="National Climate Change Response Database">
          <Typography color="textPrimary" variant="h5" variantMapping={{ h5: 'h1' }}>
            NCCRD {NCCRD_DEPLOYMENT_ENV === 'production' ? '' : '(dev)'}
          </Typography>
        </Tooltip>
      }
      routes={routes}
    />
    <SizeContent>
      <RouteSwitcher routes={routes} />
    </SizeContent>
    <Footer routes={routes} />
  </Application>,
  document.getElementById('root')
)
