import { useContext } from 'react'
import MuiLink from '@mui/material/Link'
import { Link } from 'react-router-dom'
import { context as authenticationContext } from '../../contexts/authentication'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import Loading from '../../components/loading'
import Header from './header'
import Container from '@mui/material/Container'

export default () => {
  const theme = useTheme()
  const { user: { emailAddress = '' } = {}, authenticate } = useContext(authenticationContext)
  const isAuthenticated = authenticate()

  if (!isAuthenticated) {
    return <Loading />
  }

  return (
    <>
      <Header />
      <div style={{ marginTop: theme.spacing(2) }} />
      <Container style={{ minHeight: 1000 }}>
        <Card style={{ border: 'none', width: '100%' }} variant="outlined">
          <CardContent>
            <Typography gutterBottom>
              Hi {emailAddress}. This page is not completed yet. In the future there will be all
              sorts of useful things.
            </Typography>
            <Typography>
              In the meantime, you can look at your completed and incomplete submissions{' '}
              <MuiLink component={Link} to="/user/submissions" underline="hover">
                here
              </MuiLink>
            </Typography>
          </CardContent>
        </Card>
      </Container>
      <div style={{ marginTop: theme.spacing(2) }} />
    </>
  )
}
