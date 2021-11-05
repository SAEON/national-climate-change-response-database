import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'
import FormattedObject from './_formatted-object'

export default ({ title, json }) => {
  const theme = useTheme()

  return (
    <Card style={{ backgroundColor: theme.backgroundColor, height: '100%' }} variant="outlined">
      <CardHeader title={title} />
      <CardContent>
        <FormattedObject json={json} />
      </CardContent>
    </Card>
  )
}
