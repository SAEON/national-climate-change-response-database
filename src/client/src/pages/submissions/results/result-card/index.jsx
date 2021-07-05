import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import useTheme from '@material-ui/core/styles/useTheme'
import Delete from './_delete'
import View from './_view'
import Edit from './_edit'
import Download from './_download'
import Title from './_title'
import Description from './_description'

export default ({ id, project }) => {
  const theme = useTheme()

  return (
    <Card variant="outlined" style={{ width: '100%', backgroundColor: theme.backgroundColor }}>
      <Title {...project} />
      <Description {...project} />
      <CardActions style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Delete id={id} />
        <View id={id} />
        <Edit id={id} />
        <Download />
      </CardActions>
    </Card>
  )
}
