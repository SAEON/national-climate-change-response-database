import { useContext, useRef } from 'react'
import { context as clientContext } from '../../contexts/client-context'
import ChartDataProvider from './context'
import Header from './header'
import Heatmap from './heatmap'
import Content from './content'
import Container from '@mui/material/Container'
import BoxButton from '../../components/fancy-buttons/box-button'
import { Div } from '../../components/html-tags'
import Grid from '@mui/material/Grid'
import { Typography } from '@mui/material'

export default () => {
  const {
    region: { name: regionName },
  } = useContext(clientContext)

  const ref = useRef(null)
  return (
    <ChartDataProvider>
      <Header />
      {/* MAP */}
      <Heatmap contentRef={ref}>
        <Div
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 99,
            mr: theme => theme.spacing(1),
            mb: theme => theme.spacing(1),
          }}
        >
          <Typography variant="overline" sx={{ color: theme => theme.palette.common.white }}>
            {regionName}&apos; climate changes response region-density
          </Typography>
        </Div>
        <Div sx={{ position: 'absolute', zIndex: 100, left: 0, right: 0, top: 0, bottom: 0 }}>
          <Div sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Container>
              <Grid container justifyContent="center">
                <Grid item xs={12} sm={8} md={6}>
                  <Div sx={{ height: 100, width: '100%' }}>
                    <BoxButton title={`Explore projects`} />
                  </Div>
                </Grid>
              </Grid>
            </Container>
          </Div>
        </Div>
      </Heatmap>
      {/* CONTENT */}
      <Content ref={el => (ref.current = el)} />
    </ChartDataProvider>
  )
}
