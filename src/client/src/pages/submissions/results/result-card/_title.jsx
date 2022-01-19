import Avatar from '@mui/material/Avatar'
import ProjectIcon from 'mdi-react/FormSelectIcon'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'

export default ({ title }) => (
  <CardHeader
    avatar={
      <Avatar
        sx={theme => ({
          width: theme.spacing(3),
          height: theme.spacing(3),
          backgroundColor: theme.palette.primary.main,
        })}
      >
        <ProjectIcon size={14} />
      </Avatar>
    }
    title={<Typography variant="overline">{title}</Typography>}
  />
)
