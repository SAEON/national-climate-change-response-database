import { useContext } from 'react'
import { context as clientContext } from '../../contexts/client-context'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import { styled, alpha } from '@mui/material/styles'

const Text = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  color: alpha(theme.palette.common.white, 0.9),
  marginBottom: theme.spacing(2),
}))

export default () => {
  const { about: pageContent } = JSON.parse(useContext(clientContext).frontMatter)

  return (
    <Container sx={{ minHeight: 1000 }}>
      <Text>{pageContent.content}</Text>
    </Container>
  )
}
