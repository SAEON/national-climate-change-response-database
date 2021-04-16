import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import useTheme from '@material-ui/core/styles/useTheme'
import BannerToolbar from './banner/toolbar'
import Banner, { IMAGE_HEIGHT } from './banner'
import Divider from '@material-ui/core/Divider'
import ApplicationToolbar from './appbar'

export default props => {
  const theme = useTheme()

  return (
    <>
      <AppBar color="inherit">
        <Banner {...props} />
        <Divider />
        <ApplicationToolbar />
      </AppBar>

      {/* Push content down below banner and toolbar */}
      <BannerToolbar>
        <div style={{ minHeight: IMAGE_HEIGHT + theme.spacing(2) }}></div>
      </BannerToolbar>
      <Toolbar />
    </>
  )
}
