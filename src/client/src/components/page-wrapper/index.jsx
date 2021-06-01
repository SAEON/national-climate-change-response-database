import Box from '@material-ui/core/Box'
import Container from '@material-ui/core/Container'

export default ({ children }) => {
  return (
    <Container>
      <Box py={2} paddingBottom={8}>
        {children}
      </Box>
    </Container>
  )
}
