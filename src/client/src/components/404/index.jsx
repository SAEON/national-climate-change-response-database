import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Icon from 'mdi-react/NoIcon'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

export default ({ noContainer = false }) => {
  if (noContainer) {
    return (
      <Card variant="outlined">
        <CardHeader
          avatar={
            <Avatar
              sx={theme => ({
                width: theme.spacing(4),
                height: theme.spacing(4),
                backgroundColor: theme.palette.primary.main,
              })}
            >
              <Icon size={24} />
            </Avatar>
          }
          title={<Typography variant="h4">404</Typography>}
        />
        <CardContent>Resource not found</CardContent>
      </Card>
    )
  }

  return (
    <Container>
      <Card variant="outlined">
        <CardHeader
          avatar={
            <Avatar
              sx={theme => ({
                width: theme.spacing(4),
                height: theme.spacing(4),
                backgroundColor: theme.palette.primary.main,
              })}
            >
              <Icon size={24} />
            </Avatar>
          }
          title={<Typography variant="h4">404</Typography>}
        />
        <CardContent>Resource not found</CardContent>
      </Card>
    </Container>
  )
}
