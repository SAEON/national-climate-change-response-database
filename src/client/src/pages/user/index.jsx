import { useContext } from 'react'
import MuiLink from '@material-ui/core/Link'
import { Link } from 'react-router-dom'
import { context as authenticationContext } from '../../contexts/authentication'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import useTheme from '@material-ui/core/styles/useTheme'
import Loading from '../../components/loading'
import Header from '../../components/toolbar-header'
import Wrapper from '../../components/page-wrapper'

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
      <Wrapper>
        <Card
          style={{ border: 'none', width: '100%', backgroundColor: theme.backgroundColor }}
          variant="outlined"
        >
          <CardContent>
            <Typography gutterBottom>
              Hi {emailAddress}. This page is not completed yet. In the future there will be all
              sorts of useful things.
            </Typography>
            <Typography>
              In the meantime, you can look at your completed and incomplete submissions{' '}
              <MuiLink component={Link} to="/user/submissions">
                here
              </MuiLink>
            </Typography>
          </CardContent>
        </Card>
      </Wrapper>
    </>
  )
}
