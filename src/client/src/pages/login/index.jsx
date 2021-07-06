import Wrapper from '../../components/page-wrapper'
import Header from '../../components/toolbar-header'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { NCCRD_API_HTTP_ADDRESS } from '../../config'
import getUriState from '../../lib/get-uri-state'
import NrfIcon from '../../icons/nrf-icon'

export default () => {
  const { redirect = window.location.href } = getUriState()

  return (
    <>
      <Header />
      <Wrapper>
        <Grid container justify="center">
          <Grid item xs={12} sm={8} md={4} style={{ display: 'flex', justifyContent: 'center' }}>
            <Card variant="outlined" style={{ width: '100%' }}>
              <CardHeader title="Authentication" />
              <CardContent>
                <Typography variant="body2">
                  The NCCRD uses the Single Sign on authentication service provided by{' '}
                  <Link href="https://ulwazi.saeon.ac.za">SAEON Ulwazi</Link>. Please login to
                  continue. (If you don&apos;t already have an account you will be prompted to
                  create one)
                </Typography>
              </CardContent>
              <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  startIcon={<NrfIcon />}
                  href={`${NCCRD_API_HTTP_ADDRESS}/login?redirect=${redirect}`}
                  variant="outlined"
                  disableElevation
                  color="primary"
                >
                  Log in
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Wrapper>
    </>
  )
}
