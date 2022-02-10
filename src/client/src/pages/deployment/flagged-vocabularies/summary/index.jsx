import { useContext } from 'react'
import { context as dataContext } from '../_context'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

export default () => {
  const { json } = useContext(dataContext)
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="body1" gutterBottom>
          The submissions have information that conflicts with controlled vocabulary trees. These
          entries need to be checked and fixed manually
        </Typography>
        <Typography variant="overline">Please fix {json.length} fields</Typography>
      </CardContent>
    </Card>
  )
}
