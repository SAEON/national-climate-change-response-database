import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import ReactMarkdown from 'react-markdown'
import { useTheme } from '@mui/material/styles'
import content from './_content'

export default () => {
  const theme = useTheme()

  return (
    <>
      <div style={{ marginTop: theme.spacing(2) }} />
      <Container>
        <Card variant="outlined" style={{ minHeight: 1000 }}>
          <CardContent>
            <ReactMarkdown>{content}</ReactMarkdown>
          </CardContent>
        </Card>
      </Container>
      <div style={{ marginTop: theme.spacing(2) }} />
    </>
  )
}
