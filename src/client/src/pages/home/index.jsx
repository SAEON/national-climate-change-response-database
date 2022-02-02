import { useRef, useContext } from 'react'
import { context as clientContext } from '../../contexts/client-context'
import ChartDataProvider from './context'
import Header from './header'
import Heatmap from './heatmap'
import Content from './content'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { Div } from '../../components/html-tags'
import { alpha } from '@mui/material/styles'
import Card from '@mui/material/Card'

export default ({ routes }) => {
  const { about: pageContent } = JSON.parse(useContext(clientContext).frontMatter)
  const ref = useRef(null)

  return (
    <ChartDataProvider>
      <Header />

      {/* MAP */}
      <Heatmap contentRef={ref}>
        <Div sx={{ position: 'absolute', zIndex: 100, left: 0, right: 0, top: 0, bottom: 0 }}>
          <Div sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <Container>
              <Card
                variant="outlined"
                sx={{
                  boxShadow: 3,
                  backgroundColor: theme => alpha(theme.palette.common.black, 0.4),
                  padding: theme => theme.spacing(8),
                }}
              >
                <Grid container spacing={2} justifyContent="center">
                  <Grid item lg={6} sx={{ display: 'flex' }}>
                    <Typography
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        textAlign: 'center',
                        color: theme => alpha(theme.palette.common.white, 0.9),
                      }}
                      variant="h5"
                    >
                      {pageContent.title}
                    </Typography>
                  </Grid>
                  <Grid item lg={6} sx={{ flexGrow: 1 }}>
                    <Typography
                      sx={{
                        textAlign: 'left',
                        color: theme => alpha(theme.palette.common.white, 0.9),
                      }}
                      variant="body2"
                    >
                      {pageContent.content}
                    </Typography>
                  </Grid>
                </Grid>
              </Card>
            </Container>
          </Div>
        </Div>
      </Heatmap>

      {/* CONTENT */}
      <Content routes={routes} ref={el => (ref.current = el)} />
    </ChartDataProvider>
  )
}
