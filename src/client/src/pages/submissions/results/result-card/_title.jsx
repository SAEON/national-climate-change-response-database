import Avatar from '@mui/material/Avatar'
import ProjectIcon from 'mdi-react/FormSelectIcon'
import CardHeader from '@mui/material/CardHeader'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

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
