import { useContext } from 'react'
import { context as clientContext } from '../../contexts/client-context'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { Div } from '../../components/html-tags'

export default () => {
  const { about: pageContent } = JSON.parse(useContext(clientContext).frontMatter)

  return (
    <>
      <Div sx={{ marginTop: theme => theme.spacing(2) }} />
      <Container>
        <Card variant="outlined" sx={{ minHeight: 1000 }}>
          <CardContent>
            <Typography
              variant="h4"
              sx={{
                textAlign: 'center',
                marginBottom: theme => theme.spacing(3),
              }}
            >
              {pageContent.title}
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: 'left',
              }}
            >
              {pageContent.content}
            </Typography>
          </CardContent>
        </Card>
      </Container>
      <Div sx={{ marginTop: theme => theme.spacing(2) }} />
    </>
  )
}
