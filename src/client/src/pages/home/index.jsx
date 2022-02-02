import { useRef } from 'react'
import ChartDataProvider from './context'
import Header from './header'
import Heatmap from './heatmap'
import Content from './content'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import BoxButton from '../../components/fancy-buttons/box-button'
import { Div } from '../../components/html-tags'

export default ({ routes }) => {
  const ref = useRef(null)

  return (
    <ChartDataProvider>
      <Header />

      {/* MAP */}
      <Heatmap contentRef={ref}>
        <Div sx={{ position: 'absolute', zIndex: 100, left: 0, right: 0, top: 0, bottom: 0 }}>
          <Div sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Container>
              <Grid container justifyContent="center">
                <Grid item xs={12} sm={8} md={6}>
                  <Div sx={{ height: 100, width: '100%' }}>
                    <BoxButton
                      sx={{ boxShadow: 3 }}
                      title={`Explore climate change response projects`}
                    />
                  </Div>
                </Grid>
              </Grid>
            </Container>
          </Div>
        </Div>
      </Heatmap>

      {/* CONTENT */}
      <Content routes={routes} ref={el => (ref.current = el)} />
    </ChartDataProvider>
  )
}
