import Card from '@material-ui/core/Card'
import Avatar from '@material-ui/core/Avatar'
import Icon from 'mdi-react/CancelIcon'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import useTheme from '@material-ui/core/styles/useTheme'
import Typography from '@material-ui/core/Typography'

export default ({ requiredMinimumRole = 'NA' }) => {
  const theme = useTheme()

  return (
    <Card style={{ backgroundColor: theme.backgroundColor }}>
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
        You do not have sufficient access rights to view this resource (required role:{' '}
        {requiredMinimumRole}). Please contact a system administrator if you need access to this
        resource
      </CardContent>
    </Card>
  )
}
