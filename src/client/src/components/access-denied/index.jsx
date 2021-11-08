import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Icon from 'mdi-react/CancelIcon'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

export default ({ requiredPermission = 'NA' }) => {
  const theme = useTheme()

  return (
    <Container>
      <Card variant="outlined" style={{ backgroundColor: theme.backgroundColor }}>
        <CardHeader
          avatar={
            <Avatar
              style={{
                width: theme.spacing(4),
                height: theme.spacing(4),
                backgroundColor: theme.palette.primary.main,
              }}
            >
              <Icon size={24} />
            </Avatar>
          }
          title={<Typography variant="h4">No Access</Typography>}
        />
        <CardContent>
          You do not have sufficient access rights to view this resource (required permission:{' '}
          {requiredPermission}). Please contact a system administrator if you need access to this
          resource
        </CardContent>
      </Card>
    </Container>
  )
}
