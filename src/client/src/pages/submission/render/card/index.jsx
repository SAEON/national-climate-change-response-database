import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormattedObject from './_formatted-object'

export default ({ title, json }) => {
  return (
    <Card style={{ height: '100%' }} variant="outlined">
      <CardHeader title={title} />
      <CardContent>
        <FormattedObject json={json} />
      </CardContent>
    </Card>
  )
}
