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
import useMediaQuery from '@mui/material/useMediaQuery'
import useTheme from '@mui/material/styles/useTheme'

const Entry = () => {
  const theme = useTheme()
  const mdDown = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <>
      <Header
        title={
          <Tooltip title="National Climate Change Response Database">
            <Typography color="textPrimary" variant="h5" variantMapping={{ h5: 'h1' }}>
              {NCCRD_DEPLOYMENT_ENV === 'production'
                ? mdDown
                  ? 'NCCRD'
                  : 'National Climate Change Response Database'
                : 'NCCRD:DEV'}
            </Typography>
          </Tooltip>
        }
        routes={routes}
      />
      <SizeContent>
        <RouteSwitcher routes={routes} />
      </SizeContent>
      <Footer routes={routes} />
    </>
  )
}

render(
  <Application>
    <Entry />
  </Application>,
  document.getElementById('root')
)
