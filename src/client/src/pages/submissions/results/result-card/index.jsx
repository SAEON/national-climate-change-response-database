import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import { useTheme } from '@mui/material/styles'
import Delete from './_delete'
import View from './_view'
import Edit from './_edit'
import Download from '../../../../components/download-record'
import Title from './_title'
import Description from './_description'

export default ({ id, project, createdBy }) => {
  const theme = useTheme()

  return (
    <Card variant="outlined" style={{ width: '100%', backgroundColor: theme.backgroundColor }}>
      <Title {...project} />
      <Description {...project} />
      <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Delete createdBy={createdBy} id={id} />
        <View id={id} />
        <Edit createdBy={createdBy} id={id} />
        <Download id={id} title={project.title} />
      </CardActions>
    </Card>
  )
}
