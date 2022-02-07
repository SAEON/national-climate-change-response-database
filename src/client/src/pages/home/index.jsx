import { useRef, useState } from 'react'
import ChartDataProvider from './context'
import Header from './header'
import Heatmap from './heatmap'
import PageLinks from './page-links'
import Welcome from './welcome'
import { Div } from '../../components/html-tags'
import Container_ from '@mui/material/Container'
import Tenants from './tenants'
import Charts from './charts'
import { alpha } from '@mui/material/styles'
import ScrollButton from './_scroll-button'
import Typography from '@mui/material/Typography'

const Container = props => <Container_ sx={{ py: theme => theme.spacing(8) }} {...props} />

const Title = props => (
  <Typography
    variant="h4"
    sx={{
      textAlign: 'center',
      mt: theme => theme.spacing(3),
      mb: theme => theme.spacing(6),
      color: theme => alpha(theme.palette.common.white, 0.9),
    }}
    {...props}
  />
)

const Bg = ({ sx = {}, ...props }) => (
  <Div
    sx={{
      pb: theme => theme.spacing(6),
      ...sx,
    }}
    {...props}
  />
)

export default () => {
  const contentRef = useRef(null)
  const [toolbarRef, setToolbarRef] = useState(null)

  return (
    <ChartDataProvider>
      <Header ref={el => setToolbarRef(el)} />

      {/* MAP */}
      <Heatmap id="/home-heatmap" contentRef={contentRef} toolbarRef={toolbarRef}>
        <Welcome />
        <ScrollButton contentRef={contentRef} />
      </Heatmap>

      {/* CONTENT */}
      <Div ref={el => (contentRef.current = el)}>
        {/* PAGE LINKS */}
        <Bg sx={{ backgroundColor: theme => alpha(theme.palette.common.black, 0.4) }}>
          <Container>
            <Title>Our platform</Title>
            <PageLinks />
          </Container>
        </Bg>

        {/* CHARTS */}
        <Bg sx={{ backgroundColor: theme => alpha(theme.palette.common.black, 0.2) }}>
          <Container>
            <Title>Our data</Title>
            <Charts />
          </Container>
        </Bg>

        {/* TENANTS */}
        <Bg sx={{ backgroundColor: theme => alpha(theme.palette.common.black, 0.1) }}>
          <Container>
            <Title>Regional databases</Title>
            <Tenants />
          </Container>
        </Bg>
      </Div>
    </ChartDataProvider>
  )
}
