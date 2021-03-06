import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import Delete from './_delete'
import View from './_view'
import Edit from './_edit'
import Download from '../../../../components/download-record'
import Title from './_title'
import Description from './_description'

export default ({ id, project, createdBy }) => {
  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <Title {...project} />
      <Description {...project} />
      <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Delete createdBy={createdBy} id={id} />
        <View id={id} />
        <Edit createdBy={createdBy} id={id} />
        <Download variant="text" id={id} title={project.title} />
      </CardActions>
    </Card>
  )
}
