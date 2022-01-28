import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import ReactMarkdown from 'react-markdown'
import content from './_content'
import { Div } from '../../components/html-tags'

export default () => {
  return (
    <>
      <Div sx={{ marginTop: theme => theme.spacing(2) }} />
      <Container>
        <Card variant="outlined" sx={{ minHeight: 1000 }}>
          <CardContent>
            <ReactMarkdown>{content}</ReactMarkdown>
          </CardContent>
        </Card>
      </Container>
      <Div sx={{ marginTop: theme => theme.spacing(2) }} />
    </>
  )
}
