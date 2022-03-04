import { useContext } from 'react'
import { context as clientContext } from '../../../contexts/client-context'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { Div } from '../../../components/html-tags'
import { alpha } from '@mui/material/styles'
import Card from '@mui/material/Card'
import Fade from '@mui/material/Fade'

export default () => {
  const { about: pageContent } = JSON.parse(useContext(clientContext).frontMatter)

  return (
    <Fade key="welcome-in" in={true}>
      <Div sx={{ position: 'absolute', zIndex: 8, left: 0, right: 0, top: 0, bottom: 0 }}>
        <Div sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <Container sx={{ maxHeight: '88%', overflowY: 'auto' }}>
            <Card
              variant="outlined"
              sx={{
                boxShadow: 3,
                backgroundColor: theme => alpha(theme.palette.common.black, 0.4),
                padding: theme => theme.spacing(6),
              }}
            >
              <Grid container spacing={2} justifyContent="center">
                <Grid item lg={6} sx={{ display: 'flex' }}>
                  <Typography
                    sx={theme => ({
                      alignItems: 'center',
                      display: 'flex',
                      textAlign: 'center',
                      color: alpha(theme.palette.common.white, 0.9),
                      [theme.breakpoints.down('lg')]: {
                        mb: theme.spacing(2),
                      },
                      [theme.breakpoints.down('sm')]: {
                        fontSize: '1.1rem',
                      },
                    })}
                    variant="h5"
                  >
                    {pageContent.title}
                  </Typography>
                </Grid>

                <Grid item lg={6} sx={{ flexGrow: 1 }}>
                  {pageContent.content.split('\n').map((text, i) => {
                    return (
                      <Typography
                        key={i}
                        sx={theme => ({
                          mb: theme.spacing(1),
                          textAlign: 'center',
                          display: i === 0 ? 'inherit' : 'none',
                          color: alpha(theme.palette.common.white, 0.9),
                          [theme.breakpoints.up('sm')]: {
                            textAlign: 'justify',
                            display: 'inherit',
                          },
                        })}
                        variant="body2"
                      >
                        {text ? text : <br />}
                      </Typography>
                    )
                  })}
                </Grid>
              </Grid>
            </Card>
          </Container>
        </Div>
      </Div>
    </Fade>
  )
}
