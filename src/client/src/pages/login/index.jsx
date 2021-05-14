import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Typography from '@material-ui/core/Typography'
import GoogleAuth from './_google'
import SAEONAuth from './_saeon'
import getUriState from '../../lib/get-uri-state'

export default () => {
  const { redirect } = getUriState()

  return (
    <main
      style={{
        display: 'flex',
        alignItems: 'center',
        position: 'absolute',
        top: window.location.pathname.includes('render') ? 0 : 48,
        bottom: 0,
        justifyContent: 'center',
        left: 0,
        right: 0,
      }}
      id="login"
    >
      <Card style={{ maxWidth: 400, position: 'relative', top: -100 }}>
        <CardHeader
          style={{ textAlign: 'center' }}
          title={<Typography variant="overline">Log in</Typography>}
        />
        <CardContent>
          <GoogleAuth redirect={redirect} />
          <SAEONAuth redirect={redirect} />
        </CardContent>
      </Card>
    </main>
  )
}
