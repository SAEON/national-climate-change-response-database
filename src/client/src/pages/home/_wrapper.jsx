import Box from '@mui/material/Box'
import Container from '@mui/material/Container'

export default ({ children }) => {
  return (
    <Container>
      <Box py={12}>{children}</Box>
    </Container>
  )
}
