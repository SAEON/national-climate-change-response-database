import { useRef, useState } from 'react'
import ChartDataProvider from './context'
import Header from './header'
import Heatmap from './heatmap'
import PageLinks from './page-links'
import Welcome from './welcome'
import { Div } from '../../components/html-tags'
import Container from '@mui/material/Container'
import { alpha } from '@mui/material/styles'
import Grid from '@mui/material/Grid'
import Tenants from './tenants'
import Charts from './charts'

const G = ({ sx = {}, ...props }) => (
  <Grid container spacing={8} sx={{ my: theme => theme.spacing(6), ...sx }} {...props} />
)

export default () => {
  const contentRef = useRef(null)
  const [toolbarRef, setToolbarRef] = useState(null)

  return (
    <ChartDataProvider>
      <Header ref={el => setToolbarRef(el)} />

      {/* MAP */}
      <Heatmap contentRef={contentRef} toolbarRef={toolbarRef}>
        <Welcome />
      </Heatmap>

      {/* CONTENT */}
      <Div ref={el => (contentRef.current = el)}>
        {/* CHARTS */}
        <Div sx={{ backgroundColor: theme => alpha(theme.palette.common.white, 0.4) }}>
          <Container
            sx={{
              paddingTop: theme => theme.spacing(12),
              paddingBottom: theme => theme.spacing(12),
            }}
          >
            <Div sx={{ mx: theme => theme.spacing(8) }}>
              <G>
                <Charts />
              </G>
            </Div>
          </Container>
        </Div>

        {/* PAGE LINKS */}
        <Div sx={{ backgroundColor: theme => alpha(theme.palette.common.black, 0.4) }}>
          <Container
            sx={{
              paddingTop: theme => theme.spacing(3),
              paddingBottom: theme => theme.spacing(12),
            }}
          >
            <G>
              <PageLinks />
            </G>
          </Container>
        </Div>

        {/* TENANTS */}
        <Div sx={{ backgroundColor: theme => alpha(theme.palette.common.white, 0.1) }}>
          <Container
            sx={{
              paddingTop: theme => theme.spacing(3),
              paddingBottom: theme => theme.spacing(12),
            }}
          >
            <Div sx={{ mx: theme => theme.spacing(8) }}>
              <G>
                <Tenants />
              </G>
            </Div>
          </Container>
        </Div>
      </Div>
    </ChartDataProvider>
  )
}
