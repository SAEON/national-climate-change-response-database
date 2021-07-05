import Avatar from '@material-ui/core/Avatar'
import ProjectIcon from 'mdi-react/FormSelectIcon'
import CardHeader from '@material-ui/core/CardHeader'
import useTheme from '@material-ui/core/styles/useTheme'
import Typography from '@material-ui/core/Typography'

export default ({ title }) => {
  const theme = useTheme()

  return (
    <CardHeader
      avatar={
        <Avatar
          style={{
            width: theme.spacing(3),
            height: theme.spacing(3),
            backgroundColor: theme.palette.primary.main,
          }}
        >
          <ProjectIcon size={14} />
        </Avatar>
      }
      title={<Typography variant="overline">{title}</Typography>}
    />
  )
}
