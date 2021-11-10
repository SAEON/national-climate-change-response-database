import Header from '../../components/toolbar-header'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { NCCRD_API_HTTP_ADDRESS } from '../../config'
import getUriState from '../../lib/get-uri-state'
import Container from '@mui/material/Container'
import NrfIcon from '../../icons/nrf-icon'
import useTheme from '@mui/styles/useTheme'

export default () => {
  const { redirect = window.location.href } = getUriState()
  const theme = useTheme()

  return (
    <>
      <Header />
      <div style={{ marginTop: theme.spacing(2) }} />
      <Container style={{ minHeight: 1000 }}>
        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={4} style={{ display: 'flex', justifyContent: 'center' }}>
            <Card variant="outlined" style={{ width: '100%' }}>
              <CardHeader title="Log in" />
              <CardContent>
                <Typography gutterBottom variant="body2">
                  Please login to continue. (If you don&apos;t already have an account you will be
                  prompted to create one)
                </Typography>
              </CardContent>
              <CardActions
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  flexDirection: 'column',
                  padding: theme.spacing(2),
                }}
              >
                <Button
                  fullWidth
                  size="large"
                  startIcon={<NrfIcon />}
                  href={`${NCCRD_API_HTTP_ADDRESS}/login?redirect=${redirect}`}
                  variant="outlined"
                  disableElevation
                  color="primary"
                >
                  Log in
                </Button>
                <Typography
                  style={{
                    display: 'block',
                    textAlign: 'right',
                    marginTop: theme.spacing(4),
                  }}
                  variant="caption"
                >
                  SSO powered by{' '}
                  <Link href="https://ulwazi.saeon.ac.za" underline="hover">
                    SAEON Ulwazi
                  </Link>
                </Typography>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <div style={{ marginTop: theme.spacing(2) }} />
    </>
  )
}
